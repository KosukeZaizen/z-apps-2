using System.Collections.Generic;
using System.Linq;
using System.Data;
using System;
using Z_Apps.Util;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Z_Apps.Models.SystemBase;

namespace Z_Apps.Models.Articles
{
    public class ArticlesService
    {
        public static readonly Dictionary<string, int> AuthorPass =
            new Dictionary<string, int>() {
                {PrivateConsts.REGISTER_PASS, 1}, // Admin
                {PrivateConsts.ARTICLE_AUTHOR_PASS_2, 2}, // Leah
                {PrivateConsts.ARTICLE_AUTHOR_PASS_3, 3}, // Toya
            };

        public Article GetArticle(string p)
        {
            var con = new DBCon();
            var result = con.ExecuteSelect(@"
SELECT title, description, articleContent, imgPath, isAboutFolktale, authorId
FROM tblArticles
WHERE url = @p and released = 1
AND title != N'folktale'
", new Dictionary<string, object[]> { { "@p", new object[2] { SqlDbType.NVarChar, p } } }
            ).FirstOrDefault();

            if (result == null)
            {
                // 1件もデータがなければ、
                // フロントから不正なパラメータが来ている可能性があるためエラー
                throw new Exception();
            }

            return new Article()
            {
                title = (string)result["title"],
                description = (string)result["description"],
                articleContent = (string)result["articleContent"],
                imgPath = (string)result["imgPath"],
                isAboutFolktale = result["isAboutFolktale"] != null ? (bool)result["isAboutFolktale"] : false,
                authorId = (int)result["authorId"],
            };
        }

        public IEnumerable<Article> GetAllArticles(bool isAboutFolktale = false)
        {
            var con = new DBCon();
            var result = con.ExecuteSelect(@"
SELECT url, title, description, imgPath, authorId
FROM tblArticles
WHERE released = 1 and isAboutFolktale = @isAboutFolktale
AND title != N'folktale'
ORDER BY orderNumber DESC
",
                    new Dictionary<string, object[]> {
                        { "@isAboutFolktale", new object[2] { SqlDbType.Bit, isAboutFolktale } }
                    }
                );

            return result.Select(r => new Article()
            {
                url = (string)r["url"],
                title = (string)r["title"],
                description = (string)r["description"],
                imgPath = (string)r["imgPath"],
                authorId = (int)r["authorId"],
            }
            );
        }

        public IEnumerable<Article> GetNewArticles(
            bool isAboutFolktale = false, int num = 5)
        {
            var con = new DBCon();
            var result = con.ExecuteSelect(@"
SELECT url, title, description, imgPath, authorId
FROM tblArticles
WHERE released = 1 and isAboutFolktale = @isAboutFolktale
AND title != N'folktale'
ORDER BY orderNumber DESC
",
                        new Dictionary<string, object[]> {
                            { "@isAboutFolktale", new object[2] { SqlDbType.Bit, isAboutFolktale } }
                        }
                    );

            return result.Select(r => new Article()
            {
                url = (string)r["url"],
                title = (string)r["title"],
                description = (string)r["description"],
                imgPath = (string)r["imgPath"],
                authorId = (int)r["authorId"],
            }).Take(num);
        }

        public IEnumerable<Article> GetRandomArticles(
            bool isAboutFolktale,
            int num,
            IEnumerable<string> wordsToExclude
        )
        {
            if (wordsToExclude == null)
            {
                wordsToExclude = new List<string>();
            }

            var con = new DBCon();
            var result = con.ExecuteSelect(@"
SELECT url, title, description, imgPath, authorId
FROM tblArticles
WHERE released = 1 and isAboutFolktale = @isAboutFolktale
AND title != N'folktale'
ORDER BY orderNumber DESC
",
                        new Dictionary<string, object[]> {
                            { "@isAboutFolktale", new object[2] { SqlDbType.Bit, isAboutFolktale } }
                        }
                );

            return result.Select(r => new Article()
            {
                url = (string)r["url"],
                title = (string)r["title"],
                description = (string)r["description"],
                imgPath = (string)r["imgPath"],
                authorId = (int)r["authorId"],
            }).Where(a => !wordsToExclude.Any(w => a.title.Contains(w))).OrderBy(i => Guid.NewGuid()).Take(num);
        }

        public Article GetArticleForEdit(string p)
        {
            var con = new DBCon();
            var result = con.ExecuteSelect(@"
SELECT title, description, articleContent, released, isAboutFolktale, authorId
FROM tblArticles
WHERE url = @p
", new Dictionary<string, object[]> { { "@p", new object[2] { SqlDbType.NVarChar, p } } }
            ).FirstOrDefault();

            if (result == null)
            {
                // 1件もデータがなければ、
                // フロントから不正なパラメータが来ている可能性があるためエラー
                throw new Exception();
            }

            return new Article()
            {
                title = (string)result["title"],
                description = (string)result["description"],
                articleContent = (string)result["articleContent"],
                released = result["released"] != null ? (bool)result["released"] : false,
                isAboutFolktale = result["isAboutFolktale"] != null ? (bool)result["isAboutFolktale"] : false,
                authorId = (int)result["authorId"],
            };
        }

        public IEnumerable<Article> GetAllArticlesForEdit()
        {
            var con = new DBCon();
            var result = con.ExecuteSelect(@"
SELECT url, title, description, released, isAboutFolktale, authorId
FROM tblArticles
ORDER BY orderNumber DESC
", null);

            var articles = result.Select(r => new Article()
            {
                url = (string)r["url"],
                title = (string)r["title"],
                description = (string)r["description"],
                released = r["released"] != null ? (bool)r["released"] : false,
                isAboutFolktale = r["isAboutFolktale"] != null ? (bool)r["isAboutFolktale"] : false,
                authorId = (int)r["authorId"],
            });

            return articles;
        }

        public Result AddNewUrl(string url, string token)
        {
            if (url.Length <= 0)
            {
                return new Result() { result = "Url is empty" };
            }

            try
            {
                var con = new DBCon();

                string sql = "INSERT INTO tblArticles(url,authorId) VALUES (@url,@authorId);";

                bool result = con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                    { "@url", new object[2] { SqlDbType.NVarChar, url } },
                    { "@authorId", new object[2] { SqlDbType.Int, GetAuthorId(token) } },
                });

                if (!result)
                {
                    return new Result() { result = "Failed to register" };
                }
            }
            catch (Exception)
            {
                return new Result() { result = "Something is wrong" };
            }

            return new Result() { result = "success" };
        }

        public Result UpdateContents(
            string url, string title, string description,
            string articleContent, string imgPath, bool isAboutFolktale)
        {
            try
            {
                var con = new DBCon();

                string sql = @"
UPDATE tblArticles
SET    title = @title,
       description = @description,
       articleContent = @articleContent,
       imgPath = @imgPath,
       isAboutFolktale = @isAboutFolktale
WHERE  url = @url;
";

                bool result = con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                    { "@url", new object[2] { SqlDbType.NVarChar, url } },
                    { "@title", new object[2] { SqlDbType.NVarChar, title != null ? title : "" } },
                    { "@description", new object[2] { SqlDbType.NVarChar, description != null ? description : "" } },
                    { "@articleContent", new object[2] { SqlDbType.NVarChar, articleContent != null ? articleContent : "" } },
                    { "@imgPath", new object[2] { SqlDbType.NVarChar, imgPath != null ? imgPath : "" } },
                    { "@isAboutFolktale", new object[2] { SqlDbType.Bit, isAboutFolktale } }
                });

                ExecSSG(url);

                if (!result)
                {
                    return new Result() { result = "Failed to update" };
                }
            }
            catch (Exception)
            {
                return new Result() { result = "Something is wrong" };
            }

            return new Result() { result = "success" };
        }

        public Result UpdateUrl(string oldUrl, string newUrl)
        {
            try
            {
                var con = new DBCon();

                string sql = @"
UPDATE tblArticles
SET    url = @newUrl
WHERE  url = @oldUrl;
";

                bool result = con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                    { "@oldUrl", new object[2] { SqlDbType.NVarChar, oldUrl } },
                    { "@newUrl", new object[2] { SqlDbType.NVarChar, newUrl } },
                });

                ExecSSG(oldUrl);
                ExecSSG(newUrl);

                if (!result)
                {
                    return new Result() { result = "Failed to update" };
                }
            }
            catch (Exception)
            {
                return new Result() { result = "Something is wrong" };
            }

            return new Result() { result = "success" };
        }

        public int GetAuthorId(string token)
        {
            if (AuthorPass.ContainsKey(token))
            {
                return AuthorPass[token];
            }
            return 0;
        }

        public Result Register(string url)
        {
            try
            {
                var con = new DBCon();

                string sql = @"
UPDATE tblArticles
SET    released = 1
WHERE  url = @url;
";

                bool result = con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                    { "@url", new object[2] { SqlDbType.NVarChar, url } },
                });

                ExecSSG(url);

                if (!result)
                {
                    return new Result() { result = "Failed to register" };
                }
            }
            catch (Exception)
            {
                return new Result() { result = "Something is wrong" };
            }

            return new Result() { result = "success" };
        }

        public bool CheckAuthorizationForUrl(string url, string token)
        {
            var authorId = GetAuthorId(token);
            if (authorId == 1)
            {
                return true; // Admin
            }
            if (authorId == 0)
            {
                return false; // No one
            }

            var article = GetArticleForEdit(url);
            return article.authorId == authorId;
        }

        public Result Hide(string url)
        {
            try
            {
                var con = new DBCon();

                string sql = @"
UPDATE tblArticles
SET    released = 0
WHERE  url = @url;
";

                bool result = con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                    { "@url", new object[2] { SqlDbType.NVarChar, url } },
                });

                ExecSSG(url);

                if (!result)
                {
                    return new Result() { result = "Failed to hide" };
                }
            }
            catch (Exception)
            {
                return new Result() { result = "Something is wrong" };
            }

            return new Result() { result = "success" };
        }

        public Result Delete(string url)
        {
            try
            {
                var con = new DBCon();

                string sql = @"
DELETE FROM tblArticles WHERE url = @url;
";

                bool result = con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                    { "@url", new object[2] { SqlDbType.NVarChar, url } },
                });

                ExecSSG(url);

                if (!result)
                {
                    return new Result() { result = "Failed to delete" };
                }
            }
            catch (Exception ex)
            {
                return new Result() { result = ex.Message };
                // return new Result() { result = "Something is wrong" };
            }

            return new Result() { result = "success" };
        }

        public async Task<Result> UploadMedia(
            IFormFile file,
            string folderName,
            StorageService storageService
        )
        {
            if (file.Length <= 0)
            {
                return new Result()
                {
                    result = "The file is invalid!",
                };
            }

            //upload
            if (!await storageService.UploadAndOverwriteFileAsync(
                file,
                "articles/_multimedia/"
                    + folderName
                    + "/"
                    + file.FileName.Replace(" ", "_")
                )
            )
            {
                return new Result()
                {
                    result = "Upload failed!!!",
                };
            };

            return new Result()
            {
                result = "ok"
            };
        }

        public Author GetAuthorInfo(int authorId)
        {
            var con = new DBCon();
            var result = con.ExecuteSelect(@"
SELECT *
FROM tblArticlesAuthor
WHERE authorId = @authorId
", new Dictionary<string, object[]> { { "@authorId", new object[2] { SqlDbType.Int, authorId } } }
            ).FirstOrDefault();

            if (result == null)
            {
                // 1件もデータがなければ、
                // フロントから不正なパラメータが来ている可能性があるためエラー
                throw new Exception();
            }

            return new Author()
            {
                authorId = (int)result["authorId"],
                authorName = (string)result["authorName"],
                initialGreeting = (string)result["initialGreeting"],
                selfIntroduction = (string)result["selfIntroduction"],
                isAdmin = (bool)result["isAdmin"],
                imgExtension = (string)result["imgExtension"],
            };
        }

        public IEnumerable<Author> GetAllAuthors()
        {
            var con = new DBCon();

            return con
                    .ExecuteSelect("SELECT * FROM tblArticlesAuthor;", null)
                    .Select((result) =>
                    {
                        return new Author()
                        {
                            authorId = (int)result["authorId"],
                            authorName = (string)result["authorName"],
                            initialGreeting = (string)result["initialGreeting"],
                            selfIntroduction = (string)result["selfIntroduction"],
                            isAdmin = (bool)result["isAdmin"],
                            imgExtension = (string)result["imgExtension"],
                        };
                    });
        }

        public async Task<Result> UpdateAuthorInfo(
            Author author, IFormFile file, StorageService storageService
        )
        {
            if (file != null)
            {
                var uploadResult = await UploadAuthorImage(
                    file, storageService, author.authorId, author.imgExtension
                );
                if (uploadResult.result != "ok")
                {
                    return uploadResult;
                }
            }

            var updateResult = UpdateAuthorTable(author);
            return updateResult;
        }

        private async Task<Result> UploadAuthorImage(
            IFormFile file,
            StorageService storageService,
            int authorId,
            string extension
        )
        {
            if (file.Length <= 0)
            {
                return new Result()
                {
                    result = "The image file is invalid!",
                };
            }

            //upload
            if (!await storageService.UploadAndOverwriteFileAsync(
                file,
                "articles/_authors/"
                    + authorId
                    + extension
                )
            )
            {
                return new Result()
                {
                    result = "Image upload failed!!!",
                };
            };

            return new Result()
            {
                result = "ok"
            };
        }

        private Result UpdateAuthorTable(Author author)
        {
            try
            {
                var con = new DBCon();

                var extension = author.imgExtension != ""
                                    ? "imgExtension = @imgExtension,"
                                    : "";

                string sql = @$"
UPDATE  tblArticlesAuthor
SET     authorName = @authorName,
        initialGreeting = @initialGreeting,
        {extension}
        selfIntroduction = @selfIntroduction
WHERE   authorId = @authorId;
";

                bool result = con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                    { "@authorName", new object[2] { SqlDbType.NVarChar, author.authorName } },
                    { "@initialGreeting", new object[2] { SqlDbType.NVarChar, author.initialGreeting } },
                    { "@selfIntroduction", new object[2] { SqlDbType.NVarChar, author.selfIntroduction } },
                    { "@imgExtension", new object[2] { SqlDbType.NVarChar, author.imgExtension } },
                    { "@authorId", new object[2] { SqlDbType.Int, author.authorId } }
                });

                if (!result)
                {
                    return new Result() { result = "Failed to update" };
                }
            }
            catch (Exception)
            {
                return new Result() { result = "Something is wrong" };
            }

            return new Result() { result = "success" };
        }

        public void ExecSSG(string path = "")
        {
            Task.Run(async () =>
            {
                if (path != "" && path != "/articles")
                {
                    var result2 = await Fetch.GetAsync(
                            $"{Consts.ARTICLES_URL}/api/next/removeStaticCache?path=/articles/{path}"
                        );
                }

                var result1 = await Fetch.GetAsync(
                        $"{Consts.ARTICLES_URL}/api/next/removeStaticCache?path=/articles"
                    );
            });
        }
    }

    public class Result
    {
        public string result
        {
            get; set;
        }
    }
}

