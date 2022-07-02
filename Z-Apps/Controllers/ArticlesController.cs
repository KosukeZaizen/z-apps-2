using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Z_Apps.Util;
using Z_Apps.Models.Articles;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Z_Apps.Models.SystemBase;
using System.Net.Http;
using System;

namespace Z_Apps.Controllers
{
    [Route("api/[controller]")]
    public class ArticlesController : Controller
    {
        private readonly StorageService storageService;
        private readonly ArticlesService articlesService;

        public ArticlesController(StorageService storageService)
        {
            this.storageService = storageService;
            this.articlesService = new ArticlesService();
        }

        [HttpGet("[action]/")]
        public Article GetArticle(string p)
        {
            return articlesService.GetArticle(p);
        }

        [HttpGet("[action]/")]
        public IEnumerable<Article> GetAllArticles(bool isAboutFolktale = false)
        {
            return articlesService.GetAllArticles(isAboutFolktale);
        }

        [HttpGet("[action]/")]
        public IEnumerable<Article> GetNewArticles(
            bool isAboutFolktale = false, int num = 5)
        {
            return ApiCache.UseCache(
                isAboutFolktale ? "true" : "false" + num,
                () => articlesService.GetNewArticles(isAboutFolktale, num)
            );
        }


        [HttpGet("[action]/")]
        public IEnumerable<Article> GetRandomArticles(
            bool isAboutFolktale = false,
            int num = 5,
            IEnumerable<string> wordsToExclude = null
        )
        {
            return ApiCache.UseCache(
                isAboutFolktale ?
                    "true" :
                    "false" + num + string.Join("", wordsToExclude),
                () => articlesService.GetRandomArticles(
                        isAboutFolktale, num, wordsToExclude
                    )
            );
        }

        [HttpGet("[action]/")]
        public Article GetArticleForEdit(string p)
        {
            return articlesService.GetArticleForEdit(p);
        }

        [HttpGet("[action]/")]
        public IEnumerable<Article> GetAllArticlesForEdit()
        {
            return articlesService.GetAllArticlesForEdit();
        }

        [HttpPost("[action]/")]
        public Result AddNewUrl(string url, string token)
        {
            if (!ArticlesService.AuthorPass.Keys.Contains(token))
            {
                return new Result() { result = "The access token is invalid" };
            }

            return articlesService.AddNewUrl(url, token);
        }

        [HttpPost("[action]/")]
        public Result UpdateContents(
            string url, string token, string title, string description,
            string articleContent, string imgPath, bool isAboutFolktale)
        {
            if (!ArticlesService.AuthorPass.Keys.Contains(token))
            {
                return new Result() { result = "The access token is invalid" };
            }

            if (!articlesService.CheckAuthorizationForUrl(url, token))
            {
                return new Result() { result = "Failed! This article was not created by you! You can only change your own article!" };
            }

            return articlesService.UpdateContents(
                url,
                title,
                description,
                articleContent,
                imgPath,
                isAboutFolktale
            );
        }

        [HttpPost("[action]/")]
        public Result UpdateUrl(string oldUrl, string newUrl, string token)
        {
            if (!ArticlesService.AuthorPass.Keys.Contains(token))
            {
                return new Result() { result = "The access token is invalid" };
            }

            if (!articlesService.CheckAuthorizationForUrl(oldUrl, token))
            {
                return new Result() { result = "Failed! This article was not created by you! You can only change your own article!" };
            }

            return articlesService.UpdateUrl(
                oldUrl,
                newUrl
            );
        }

        [HttpPost("[action]/")]
        public Result Register(string url, string token)
        {
            if (!ArticlesService.AuthorPass.Keys.Contains(token))
            {
                return new Result() { result = "The access token is invalid" };
            }

            if (!articlesService.CheckAuthorizationForUrl(url, token))
            {
                return new Result() { result = "Failed! This article was not created by you! You can only change your own article!" };
            }

            return articlesService.Register(url);
        }

        [HttpPost("[action]/")]
        public Result Hide(string url, string token)
        {
            if (!ArticlesService.AuthorPass.Keys.Contains(token))
            {
                return new Result() { result = "The access token is invalid" };
            }

            if (!articlesService.CheckAuthorizationForUrl(url, token))
            {
                return new Result() { result = "Failed! This article was not created by you! You can only change your own article!" };
            }

            return articlesService.Hide(url);
        }

        [HttpPost("[action]/")]
        public Result Delete(string url, string token)
        {
            if (!ArticlesService.AuthorPass.Keys.Contains(token))
            {
                return new Result() { result = "The access token is invalid" };
            }

            if (!articlesService.CheckAuthorizationForUrl(url, token))
            {
                return new Result() { result = "Failed! This article was not created by you! You can only change your own article!" };
            }

            return articlesService.Delete(url);
        }

        [HttpPost("[action]")]
        public async Task<Result> UploadMedia(
            IFormFile file,
            string folderName,
            string token)
        {
            if (!ArticlesService.AuthorPass.Keys.Contains(token))
            {
                return new Result()
                {
                    result = "The access token is invalid",
                };
            }

            return await articlesService.UploadMedia(
                file,
                folderName,
                storageService
            );
        }

        [HttpGet("[action]/")]
        public Author GetAuthorInfo(int authorId)
        {
            return articlesService.GetAuthorInfo(authorId);
        }

        [HttpGet("[action]/")]
        public IEnumerable<Author> GetAllAuthors()
        {
            return articlesService.GetAllAuthors();
        }

        [HttpPost("[action]")]
        public async Task<Result> UpdateAuthorInfo(
            int authorId, string authorName, string initialGreeting, bool isAdmin,
            string selfIntroduction, IFormFile file, string token
        )
        {
            if (!ArticlesService.AuthorPass.Keys.Contains(token))
            {
                return new Result() { result = "The access token is invalid" };
            }

            var authorIdFromToken = articlesService.GetAuthorId(token);
            if (authorIdFromToken != 1 && authorIdFromToken != authorId)
            {
                return new Result()
                {
                    result = "Failed! This is not you! You can only change your own informaton!"
                };
            }

            return await articlesService
                            .UpdateAuthorInfo(
                                new Author()
                                {
                                    authorId = authorId,
                                    authorName = authorName,
                                    initialGreeting = initialGreeting,
                                    selfIntroduction = selfIntroduction,
                                    isAdmin = isAdmin,
                                    imgExtension = file != null
                                                    && file.FileName.Contains(".")
                                                        ? $".{file.FileName.Split(".").Last()}"
                                                        : "",
                                },
                                file,
                                storageService
                            );
        }

        [HttpGet("[action]")]
        public async Task<bool> CheckThumbnailExistence(
            string videoId, string fileName)
        {
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(
                    $"https://img.youtube.com/vi/{videoId}/{fileName}"
                );

                return response.IsSuccessStatusCode;
            }
        }
    }
}
