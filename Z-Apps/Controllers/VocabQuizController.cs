using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Z_Apps.Models;
using Z_Apps.Models.VocabList;
using Z_Apps.Util;

namespace Z_Apps.Controllers
{
    [Route("api/[controller]")]
    public class VocabQuizController : Controller
    {
        private VocabQuizService vocabQuizService;
        public VocabQuizController(VocabQuizService vocabQuizService)
        {
            this.vocabQuizService = vocabQuizService;
        }

        [HttpGet("[action]/{genreName?}")]
        public GenreAndVocab GetQuizData(string genreName)
        {
            return ApiCache.UseCache(genreName, () =>
            {
                if (!string.IsNullOrEmpty(genreName))
                {
                    return vocabQuizService.GetQuizData(genreName);
                }
                else
                {
                    return null;
                }
            });
        }

        [HttpGet("[action]/{genreName?}")]
        public GenreAndVocab GetQuizDataWithoutCache(string genreName)
        {
            if (!string.IsNullOrEmpty(genreName))
            {
                return vocabQuizService.GetQuizData(genreName);
            }
            else
            {
                return null;
            }
        }

        public class MergedGenreAndVocab
        {
            public VocabMergedGenre vocabMergedGenre
            {
                get; set;
            }
            public IEnumerable<Vocab> mergedVocabList
            {
                get; set;
            }
        }
        [HttpGet("[action]/{genreName?}")]
        public MergedGenreAndVocab GetMergedGenreAndVocab(string genreName)
        {
            if (!string.IsNullOrEmpty(genreName))
            {
                return vocabQuizService.GetMergedGenreAndVocab(genreName);
            }
            else
            {
                return null;
            }
        }

        [HttpGet("[action]")]
        public IEnumerable<MergedGenreAndVocab> GetAllMergedGenreAndVocab()
        {
            return vocabQuizService.GetAllMergedGenreAndVocab();
        }

        public class GenreAndVocab
        {
            public VocabGenre vocabGenre
            {
                get; set;
            }
            public IEnumerable<Vocab> vocabList
            {
                get; set;
            }
        }

        [HttpGet("[action]")]
        public IEnumerable<Vocab> GetAllVocabs()
        {

            return ApiCache.UseCache("p", () =>
            {
                return vocabQuizService.GetAllVocabs();
            });
        }

        [HttpGet("[action]")]
        public IEnumerable<VocabGenre> GetAllGenres()
        {

            return ApiCache.UseCache("p", () =>
            {
                return vocabQuizService.GetAllGenres();
            });
        }

        [HttpGet("[action]")]
        public IEnumerable<VocabGenre> GetAllGenresForEdit()
        {
            return vocabQuizService.GetAllGenresForEdit();
        }

        [HttpGet("[action]")]
        public IEnumerable<VocabMergedGenre> GetAllMergedGenres()
        {
            return vocabQuizService.GetAllMergedGenres();
        }

        public class GenresToSave
        {
            public IEnumerable<VocabGenre> genres { get; set; }
            public string token { get; set; }
        }
        [HttpPost("[action]")]
        public bool SaveVocabGenres([FromBody] GenresToSave data)
        {
            try
            {
                if (data.token != PrivateConsts.REGISTER_PASS)
                {
                    throw new Exception("The token is wrongだね！");
                }

                return vocabQuizService.SaveVocabGenres(data.genres);
            }
            catch (Exception ex)
            {
                ErrorLog.InsertErrorLog(ex.ToString());
                return false;
            }
        }

        public class MergedGenresToSave
        {
            public IEnumerable<VocabMergedGenre> genres { get; set; }
            public string token { get; set; }
        }
        [HttpPost("[action]")]
        public bool SaveVocabMergedGenres([FromBody] MergedGenresToSave data)
        {
            try
            {
                if (data.token != PrivateConsts.REGISTER_PASS)
                {
                    throw new Exception("The token is wrongだね！");
                }

                return vocabQuizService.SaveVocabMergedGenres(data.genres);
            }
            catch (Exception ex)
            {
                ErrorLog.InsertErrorLog(ex.ToString());
                return false;
            }
        }

        public class VocabListToSave
        {
            public IEnumerable<Vocab> vocabList { get; set; }
            public string token { get; set; }
        }
        [HttpPost("[action]")]
        public bool SaveVocabList([FromBody] VocabListToSave data)
        {
            try
            {
                if (data.token != PrivateConsts.REGISTER_PASS)
                {
                    throw new Exception("The token is wrongだね！");
                }

                return vocabQuizService.SaveVocabList(data.vocabList);
            }
            catch (Exception ex)
            {
                ErrorLog.InsertErrorLog(ex.ToString());
                return false;
            }
        }

        public class MergedVocabListToSave
        {
            public int mergedGenreId { get; set; }
            public IEnumerable<Vocab> vocabList { get; set; }
            public string token { get; set; }
        }
        [HttpPost("[action]")]
        public bool SaveVocabMergedList([FromBody] MergedVocabListToSave data)
        {
            try
            {
                if (data.token != PrivateConsts.REGISTER_PASS)
                {
                    throw new Exception("The token is wrongだね！");
                }

                return vocabQuizService.SaveVocabMergedList(
                    data.vocabList, data.mergedGenreId
                );
            }
            catch (Exception ex)
            {
                ErrorLog.InsertErrorLog(ex.ToString());
                return false;
            }
        }


        public class TranslateResult
        {
            public string hiragana { get; set; }
            public string english { get; set; }
        }
        public class KanjiToTranslate
        {
            public string kanji { get; set; }
            public string token { get; set; }
        }
        [HttpPost("[action]")]
        public async Task<TranslateResult> TranslateVocab(
            [FromBody] KanjiToTranslate data)
        {
            if (data.token != PrivateConsts.REGISTER_PASS)
            {
                throw new Exception("The token is wrongだね！");
            }
            return await vocabQuizService.TranslateVocab(data.kanji);
        }
    }
}