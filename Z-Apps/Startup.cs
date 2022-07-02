using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Z_Apps.Models;
using Z_Apps.Models.Stories.Stories;
using System;
using Z_Apps.Models.SystemBase;
using Z_Apps.Models.Stories;
using Z_Apps.Models.StoriesEdit;
using Z_Apps.Models.VocabList;
using Microsoft.AspNetCore.Rewrite;
using Z_Apps.Controllers;
using Microsoft.Extensions.Hosting;
using System.Web;
using Z_Apps.Util;

namespace Z_Apps
{

    public class Startup
    {

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration
        {
            get;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            var con = new DBCon();
            var storageService = new StorageService();
            var storageBackupService = new StorageBackupService(con);

            services.AddSingleton(con);
            services.AddSingleton(storageService);
            services.AddSingleton(storageBackupService);
            services.AddSingleton(new SiteMapService(storageService, storageBackupService));
            services.AddSingleton(new StoriesService(con));
            services.AddSingleton(new StoriesEditService(con));
            services.AddSingleton(new VocabQuizService(con));

#if DEBUG
#else
            services.AddSingleton(new IndexHtml());
#endif
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DBCon con, SiteMapService siteMapService)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            var options = new RewriteOptions().AddRedirect("(.*)/$", "$1");
            app.UseRewriter(options);

            app.UseCors(op => op
                .WithOrigins(new[] { "http://localhost:5001" })
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
            );

            app.Use(async (context, next) =>
            {
                var ua = context.Request.Headers["User-Agent"].ToString();
                string url = context.Request.Path.Value;
                string host = context.Request.Host.Host;
                var targetApp = Apps
                                .apps
                                .FirstOrDefault(
                                    h => host
                                        .Contains($"{h.Key}.lingual-ninja.com")
                                );

                if (targetApp == null)
                {
                    // Avoid NullReferenceException while debugging
                    targetApp =
                        host == "localhost"
                            ? new AppInfo()
                            {
                                Key = "localhost",
                                Title = "Local Debug",
                                Description = "Local Debug",
                            }
                            : Apps.apps[0];
                }

                if (targetApp.Key == AppKey.www)
                {
                    if (url.StartsWith("/articles"))
                    {
                        // articlesへのリダイレクト
                        if (url.Length <= 10)
                        {
                            // トップページ
                            context.Response.Redirect(
                                $"https://articles.lingual-ninja.com",
                                true
                            );
                        }
                        else
                        {
                            // 各記事
                            var page = url.Replace("/articles/", "");
                            context.Response.Redirect(
                                $"https://articles.lingual-ninja.com/articles/{page}",
                                true
                            );
                        }
                        return;
                    }
                    else if (url.StartsWith("/2018/"))
                    {
                        var page = url.Replace("/2018/", "");
                        context.Response.Redirect(
                            $"https://blog.lingual-ninja.com/2018/{page}",
                            true
                        );
                        return;
                    }
                    else if (url.StartsWith("/dictionary"))
                    {
                        var page = url.Replace("/dictionary", "");
                        if (page.Length > 1)
                        {
                            var pageWithoutSlash = HttpUtility
                                                    .UrlEncode(page)
                                                    .Replace("%2f", "");
                            context.Response.Redirect(
                                $"https://dictionary.lingual-ninja.com/dictionary/{pageWithoutSlash}",
                                true
                            );
                        }
                        else
                        {
                            context.Response.Redirect(
                                $"https://dictionary.lingual-ninja.com",
                                true
                            );
                        }
                        return;
                    }
                    else if (url.StartsWith("/how-to-read-japanese/"))
                    {
                        var page = url.Replace("/how-to-read-japanese/", "");
                        var pageWithoutSlash = HttpUtility
                                                .UrlEncode(page)
                                                .Replace("%2f", "");

                        context.Response.Redirect(
                            $"https://dictionary.lingual-ninja.com/dictionary/{pageWithoutSlash}",
                            true
                        );
                        return;
                    }
                }

                if (url.EndsWith("sitemap.xml"))
                {
                    context.Response.Headers.Add("Content-Type", "application/xml");

                    await context.Response.WriteAsync(
                        await siteMapService.GetSiteMapText($"{targetApp.Key}.lingual-ninja.com")
                    );
                }
                else if (ua.StartsWith("facebookexternalhit") || ua.StartsWith("Twitterbot"))
                {
                    if (url == null)
                    {
                        await next.Invoke();
                    }
                    else
                    {
                        string resultHTML = "";
                        var descriptionForHtml = HttpUtility.HtmlEncode(targetApp.Description);

                        if (url == "/")
                        {
                            // Top page of all apps
                            resultHTML = "<!DOCTYPE html><html>" +
                                "<head>" +
                                "<meta name='twitter:card' content='summary'>" + Environment.NewLine +
                                "<meta name='twitter:site' content='@LingualNinja'>" + Environment.NewLine +
                                $"<meta property='og:image' content='{Consts.Z_APPS_URL}/ogp-img.png'>" + Environment.NewLine +
                                $"<meta property='og:url' content='{Consts.Z_APPS_URL}'>" + Environment.NewLine +
                                "<meta property='og:type' content='website'>" + Environment.NewLine +
                                $"<meta property='og:title' content='{targetApp.Title}'>" + Environment.NewLine +
                                "<meta property='og:image:alt' content='Lingual Ninja'>" + Environment.NewLine +
                                $"<meta property='og:description' content='{descriptionForHtml}'>" + Environment.NewLine +
                                $"<meta property='og:site_name' content='{targetApp.Title}'>" + Environment.NewLine +
                                "<meta property='fb:app_id' content='217853132566874'>" + Environment.NewLine +
                                "<meta property='fb:page_id' content='491712431290062'>" + Environment.NewLine +
                                "</head>" + Environment.NewLine +
                                "<body>Content for SNS bot</body></html>";

                        }
                        else
                        {
                            if (targetApp.Key == AppKey.www)
                            {
                                if (url.Contains("folktales/") && url.Length > 11)
                                {
                                    string storyName = url.Split("folktales/")[1].Replace("/", "");

                                    var storyManager = new StoryManager(con);
                                    var story = storyManager.GetStory(storyName);
                                    var description = story?.Description.Replace("\\n", " ").Replace("\'", "&#39;");
                                    var title = storyName.Replace("--", " - ").Replace("_", " ");

                                    resultHTML = "<!DOCTYPE html><html>" +
                                            "<head>" + Environment.NewLine +
                                            "<meta name='twitter:card' content='summary_large_image'>" + Environment.NewLine +
                                            "<meta name='twitter:site' content='@LingualNinja'>" + Environment.NewLine +
                                            $"<meta property='og:image' content='{Consts.BLOB_URL}/folktalesImg/" + storyName.Split("--")[0] + ".png'>" + Environment.NewLine +
                                            $"<meta property='og:url' content='{Consts.Z_APPS_URL}{url}'>" + Environment.NewLine +
                                            "<meta property='og:type' content='article'>" + Environment.NewLine +
                                            $"<meta property='og:title' content='{title}'>" + Environment.NewLine +
                                            $"<meta property='og:image:alt' content='{title}'>" + Environment.NewLine +
                                            $"<meta property='og:description' content='{description}'>" + Environment.NewLine +
                                            "<meta property='og:site_name' content='Lingual Ninja'>" + Environment.NewLine +
                                            "<meta property='fb:app_id' content='217853132566874'>" + Environment.NewLine +
                                            "<meta property='fb:page_id' content='491712431290062'>" + Environment.NewLine +
                                            "</head>" + Environment.NewLine +
                                            "<body>Content for SNS bot</body></html>";

                                }
                                else if (url.Contains("folktales") && url.Length < 11)
                                {
                                    resultHTML = "<!DOCTYPE html><html>" +
                                            "<head>" + Environment.NewLine +
                                            "<meta name='twitter:card' content='summary_large_image'>" + Environment.NewLine +
                                            "<meta name='twitter:site' content='@LingualNinja'>" + Environment.NewLine +
                                            $"<meta property='og:image' content='{Consts.BLOB_URL}/folktalesImg/Momotaro.png'>" + Environment.NewLine +
                                            $"<meta property='og:url' content='{Consts.Z_APPS_URL}{url}'>" + Environment.NewLine +
                                            "<meta property='og:type' content='article'>" + Environment.NewLine +
                                            "<meta property='og:title' content='Learn Japanese from Folktales'>" + Environment.NewLine +
                                            "<meta property='og:image:alt' content='Learn Japanese from Folktales'>" + Environment.NewLine +
                                            "<meta property='og:description' content='Free web app to learn Japanese from folktales! You can read traditional Japanese folktales in Romaji, Hiragana, Kanji, and English!'>" + Environment.NewLine +
                                            "<meta property='og:site_name' content='Lingual Ninja'>" + Environment.NewLine +
                                            "<meta property='fb:app_id' content='217853132566874'>" + Environment.NewLine +
                                            "<meta property='fb:page_id' content='491712431290062'>" + Environment.NewLine +
                                            "</head>" + Environment.NewLine +
                                            "<body>Content for SNS bot</body></html>";

                                }
                                else if (url.Contains("vocabulary-quiz"))
                                {
                                    var arrUrl = url.Split("/");
                                    var lastElem = arrUrl.LastOrDefault();
                                    string title = (lastElem == "vocabulary-quiz") ?
                                        "Japanese Vocabulary Quiz" :
                                        "Japanese Vocabulary Quiz - " + string.Join(" ", lastElem.Split("_").Select((e) => System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(e)));

                                    resultHTML = "<!DOCTYPE html><html>" +
                                            "<head>" +
                                            "<meta name='twitter:card' content='summary'>" + Environment.NewLine +
                                            "<meta name='twitter:site' content='@LingualNinja'>" + Environment.NewLine +
                                            $"<meta property='og:image' content='{Consts.Z_APPS_URL}/ogp-img.png'>" + Environment.NewLine +
                                            $"<meta property='og:url' content='{Consts.Z_APPS_URL}{url}'>" + Environment.NewLine +
                                            "<meta property='og:type' content='article'>" + Environment.NewLine +
                                            $"<meta property='og:title' content='{title}'>" + Environment.NewLine +
                                            "<meta property='og:image:alt' content='Lingual Ninja'>" + Environment.NewLine +
                                            "<meta property='og:description' content='Free app to learn Japanese vocabulary! Try to get a perfect score on all the quizzes!'>" + Environment.NewLine +
                                            "<meta property='og:site_name' content='Lingual Ninja'>" + Environment.NewLine +
                                            "<meta property='fb:app_id' content='217853132566874'>" + Environment.NewLine +
                                            "<meta property='fb:page_id' content='491712431290062'>" + Environment.NewLine +
                                            "</head>" + Environment.NewLine +
                                            "<body>Content for SNS bot</body></html>";

                                }
                                else if (url.Contains("kanji-quiz"))
                                {
                                    var arrUrl = url.Split("/");
                                    var lastElem = arrUrl.LastOrDefault();
                                    string title = (lastElem == "kanji-quiz") ?
                                        "Kanji Quiz" :
                                        "Kanji Quiz - " + string.Join(" ", lastElem.Split("_").Select((e) => System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(e)));

                                    resultHTML = "<!DOCTYPE html><html>" +
                                            "<head>" +
                                            "<meta name='twitter:card' content='summary'>" + Environment.NewLine +
                                            "<meta name='twitter:site' content='@LingualNinja'>" + Environment.NewLine +
                                            $"<meta property='og:image' content='{Consts.Z_APPS_URL}/ogp-img.png'>" + Environment.NewLine +
                                            $"<meta property='og:url' content='{Consts.Z_APPS_URL}{url}'>" + Environment.NewLine +
                                            "<meta property='og:type' content='article'>" + Environment.NewLine +
                                            $"<meta property='og:title' content='{title}'>" + Environment.NewLine +
                                            "<meta property='og:image:alt' content='Lingual Ninja'>" + Environment.NewLine +
                                            "<meta property='og:description' content='Free app to learn Japanese Kanji characters! Try to get a perfect score on all the quizzes!'>" + Environment.NewLine +
                                            "<meta property='og:site_name' content='Lingual Ninja'>" + Environment.NewLine +
                                            "<meta property='fb:app_id' content='217853132566874'>" + Environment.NewLine +
                                            "<meta property='fb:page_id' content='491712431290062'>" + Environment.NewLine +
                                            "</head>" + Environment.NewLine +
                                            "<body>Content for SNS bot</body></html>";

                                }
                                else if (url.Contains("vocabulary-list"))
                                {
                                    var arrUrl = url.Split("/");
                                    var lastElem = arrUrl.LastOrDefault();
                                    string title = "Japanese Vocabulary List";

                                    resultHTML = "<!DOCTYPE html><html>" +
                                            "<head>" +
                                            "<meta name='twitter:card' content='summary'>" + Environment.NewLine +
                                            "<meta name='twitter:site' content='@LingualNinja'>" + Environment.NewLine +
                                            $"<meta property='og:image' content='{Consts.Z_APPS_URL}/ogp-img.png'>" + Environment.NewLine +
                                            $"<meta property='og:url' content='{Consts.Z_APPS_URL}{url}'>" + Environment.NewLine +
                                            "<meta property='og:type' content='article'>" + Environment.NewLine +
                                            $"<meta property='og:title' content='{title}'>" + Environment.NewLine +
                                            "<meta property='og:image:alt' content='Lingual Ninja'>" + Environment.NewLine +
                                            "<meta property='og:description' content='Free app to learn Japanese vocabulary! Try to get a perfect score on all the quizzes!'>" + Environment.NewLine +
                                            "<meta property='og:site_name' content='Lingual Ninja'>" + Environment.NewLine +
                                            "<meta property='fb:app_id' content='217853132566874'>" + Environment.NewLine +
                                            "<meta property='fb:page_id' content='491712431290062'>" + Environment.NewLine +
                                            "</head>" + Environment.NewLine +
                                            "<body>Content for SNS bot</body></html>";
                                }
                            }
                        }

                        if (resultHTML == "")
                        {
                            // Normal pages of all apps
                            resultHTML = "<!DOCTYPE html><html>" +
                                    "<head>" +
                                    "<meta name='twitter:card' content='summary'>" + Environment.NewLine +
                                    "<meta name='twitter:site' content='@LingualNinja'>" + Environment.NewLine +
                                    $"<meta property='og:image' content='https://{host}/ogp-img.png'>" + Environment.NewLine +
                                    $"<meta property='og:url' content='https://{host}{url}'>" + Environment.NewLine +
                                    "<meta property='og:type' content='article'>" + Environment.NewLine +
                                    $"<meta property='og:title' content='{targetApp.Title}'>" + Environment.NewLine +
                                    "<meta property='og:image:alt' content='Lingual Ninja'>" + Environment.NewLine +
                                    $"<meta property='og:description' content='{descriptionForHtml}'>" + Environment.NewLine +
                                    $"<meta property='og:site_name' content='{targetApp.Title}'>" + Environment.NewLine +
                                    "<meta property='fb:app_id' content='217853132566874'>" + Environment.NewLine +
                                    "<meta property='fb:page_id' content='491712431290062'>" + Environment.NewLine +
                                    "</head>" + Environment.NewLine +
                                    "<body>Content for SNS bot</body></html>";
                        }

                        var clientLogService = new ClientLogService(con);
                        clientLogService.RegisterLog(new ClientOpeLog()
                        {
                            url = url,
                            operationName = "get OGP setting",
                            userId = "SNS Bot",
                            parameters = "ua: " + ua

                        });

                        context.Response.Headers.Add("Content-Type", "text/html");
                        await context.Response.WriteAsync(resultHTML);
                    }
                }
                else
                {
                    await next.Invoke();
                }
            });

            app.UseRouting();

            if (env.IsDevelopment())
            {
                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllerRoute(
                        name: "default",
                        pattern: "{controller}/{action=Index}/{id?}"
                    );
                });

                app.UseSpa(spa =>
                {
                    spa.Options.SourcePath = "ClientApp";
                    spa.UseReactDevelopmentServer(npmScript: "start");
                });
            }
            else
            {
                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllerRoute(
                        name: "default",
                        pattern: "{controller=Home}/{action=Index}/{id?}"
                    );
                });

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapFallbackToController("Index", "Home");
                });
            }
        }
    }
}