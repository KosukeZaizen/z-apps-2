using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using static Z_Apps.Controllers.VocabQuizController;

namespace Z_Apps.Models.VocabList
{
    public class VocabQuizService
    {
        private readonly VocabGenreManager vocabGenreManager;
        private readonly VocabMergedGenreManager vocabMergedGenreManager;
        private readonly VocabManager vocabManager;

        public VocabQuizService(DBCon con)
        {
            vocabGenreManager = new VocabGenreManager(con);
            vocabMergedGenreManager = new VocabMergedGenreManager(con);

            vocabManager = new VocabManager(con);
        }

        public GenreAndVocab GetQuizData(string genreName)
        {
            var vocabGenre = vocabGenreManager.GetVocabGenre(genreName);

            IEnumerable<Vocab> vocabList = null;
            if (vocabGenre != null)
            {
                vocabList = vocabManager.GetVocabList(vocabGenre.genreId);
            }

            return new GenreAndVocab
            {
                vocabGenre = vocabGenre,
                vocabList = vocabList
            };
        }

        public MergedGenreAndVocab GetMergedGenreAndVocab(string genreName)
        {
            var vocabMergedGenre = vocabMergedGenreManager.GetVocabMergedGenre(genreName);

            IEnumerable<Vocab> vocabList = null;
            if (vocabMergedGenre != null)
            {
                vocabList = vocabManager.GetMergedVocabList(vocabMergedGenre.genreId);
            }

            return new MergedGenreAndVocab
            {
                vocabMergedGenre = vocabMergedGenre,
                mergedVocabList = vocabList
            };
        }

        public IEnumerable<MergedGenreAndVocab> GetAllMergedGenreAndVocab()
        {
            var vocabMergedGenres = vocabMergedGenreManager.GetAllMergedGenres().ToArray();

            return vocabMergedGenres.Select(g => new MergedGenreAndVocab()
            {
                vocabMergedGenre = g,
                mergedVocabList = vocabManager.GetMergedVocabList(g.genreId),
            });
        }

        public IEnumerable<Vocab> GetAllVocabs()
        {
            return vocabManager.GetAllVocabLists();
        }

        public IEnumerable<VocabGenre> GetAllGenres()
        {
            return vocabGenreManager.GetAllGenres();
        }

        public IEnumerable<VocabMergedGenre> GetAllMergedGenres()
        {
            return vocabMergedGenreManager.GetAllMergedGenres();
        }

        public IEnumerable<VocabGenre> GetAllGenresForEdit()
        {
            return vocabGenreManager.GetAllGenresForEdit();
        }

        public bool SaveVocabGenres(IEnumerable<VocabGenre> genres)
        {
            return vocabGenreManager.SaveVocabGenres(genres);
        }

        public bool SaveVocabMergedGenres(IEnumerable<VocabMergedGenre> genres)
        {
            return vocabMergedGenreManager.SaveVocabMergedGenres(genres);
        }

        public bool SaveVocabList(IEnumerable<Vocab> vocabList)
        {
            return vocabManager.SaveVocabList(vocabList);
        }

        public bool SaveVocabMergedList(IEnumerable<Vocab> vocabList, int mergedGenreId)
        {
            return vocabManager.SaveVocabMergedList(vocabList, mergedGenreId);
        }


        public async Task<TranslateResult> TranslateVocab(string kanji)
        {
            return await vocabManager.TranslateVocab(kanji);
        }
    }
}
