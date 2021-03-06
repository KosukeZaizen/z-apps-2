using System.Linq;
using System;
using System.Collections.Generic;
using Z_Apps.Models.Stories.Stories;
using Z_Apps.Models.Stories.Sentences;
using Z_Apps.Models.Stories.Words;
using Z_Apps.Util;
using System.Net.Http;
using System.Threading.Tasks;
using static Z_Apps.Controllers.StoriesEditController;
using System.Text.Json;

namespace Z_Apps.Models.StoriesEdit
{
    public class StoriesEditService
    {
        private readonly StoryManager storyManager;
        private readonly SentenceManager sentenceManager;
        private readonly WordManager wordManager;
        private readonly DBCon con;

        public StoriesEditService(DBCon con)
        {
            storyManager = new StoryManager(con);
            sentenceManager = new SentenceManager(con);
            wordManager = new WordManager(con);
            this.con = con;
        }

        public IEnumerable<Story> GetAllStories()
        {
            var stories = storyManager.GetAllStories(true);
            return stories;
        }

        public Story GetPageData(string storyName)
        {
            var story = storyManager.GetStory(storyName);
            return story;
        }

        public IEnumerable<Sentence> GetSentences(int storyId)
        {
            var sentences = sentenceManager.GetSentences(storyId);
            return sentences;
        }

        public IEnumerable<Word> GetWords(int storyId)
        {
            var words = wordManager.GetWords(storyId);
            foreach (var KV in words)
            {
                foreach (var word in KV.Value)
                {
                    yield return word;
                }
            }
        }

        public async Task<TranslationResult> Translate(Sentence sentence)
        {
            var dicHiraganaKanji = MakeHiraganaAndKanji(sentence.Kanji);
            sentence.Hiragana = dicHiraganaKanji["hiragana"];
            sentence.Romaji = MakeRomaji(sentence.Hiragana);
            sentence.English = await MakeEnglish(sentence.Kanji);

            sentence.Hiragana = ConvertSpecialChar(sentence.Hiragana);
            sentence.Romaji = ConvertSpecialChar(sentence.Romaji);
            sentence.Romaji = ConvertTsu(sentence.Romaji);

            var words = await GetTranslatedWordList(dicHiraganaKanji, sentence);

            return new TranslationResult() { sentence = sentence, words = words };
        }

        public class TranslationResult
        {
            public Sentence sentence { get; set; }
            public IEnumerable<Word> words { get; set; }
        }

        public async Task<IEnumerable<Word>> GetTranslatedWordList(
            Dictionary<string, string> dicHiraganaKanji,
            Sentence sentence)
        {
            var lstWords = new List<Word>();

            var arrHiragana = dicHiraganaKanji["hiragana"]
                .Replace("???", "")
                .Replace("???", "")
                .Replace("???", "")
                .Replace("???", "")
                .Replace("???", "")
                .Split(" ");

            var arrKanji = dicHiraganaKanji["kanji"]
                .Replace("???", "")
                .Replace("???", "")
                .Replace("???", "")
                .Replace("???", "")
                .Replace("???", "")
                .Split(" ");


            int j = 0;
            for (int i = 0; i < arrKanji.Length; i++)
            {
                if (arrKanji[i].Length > 0)
                {
                    j++;

                    var w = new Word();
                    w.StoryId = sentence.StoryId;
                    w.LineNumber = sentence.LineNumber;
                    w.WordNumber = j;
                    w.Kanji = arrKanji[i];

                    var dicWord = wordManager.GetWordMeaning(w.Kanji);
                    if (dicWord.Count > 0)
                    {
                        w.Hiragana = (string)dicWord["Hiragana"];
                        w.English = (string)dicWord["English"];
                    }
                    else
                    {
                        w.Hiragana = (w.Kanji == arrHiragana[i]) ? "" : arrHiragana[i];
                        var eng = await MakeEnglish(arrKanji[i]);
                        w.English = eng.ToLower();
                    }
                    lstWords.Add(w);
                }
            }
            return lstWords;
        }

        public Dictionary<string, string> MakeHiraganaAndKanji(string kanjis)
        {
            var dicResult = new Dictionary<string, string>() { { "kanji", "" }, { "hiragana", "" } };

            string resText = GetFurigana(kanjis);

            string[] arrFurigana1 = resText.Split("<Word>");

            foreach (string str in arrFurigana1)
            {
                if (str.Contains("</Word>"))
                {
                    string strSurfaceAndFurigana = str.Split("<SubWordList>")[0].Split("</Word>")[0];
                    if (strSurfaceAndFurigana.Contains("<Furigana>"))
                    {
                        dicResult["hiragana"] += strSurfaceAndFurigana.Split("<Furigana>")[1].Split("</Furigana>")[0] + " ";
                    }
                    else
                    {
                        dicResult["hiragana"] += strSurfaceAndFurigana.Split("<Surface>")[1].Split("</Surface>")[0] + " ";
                    }
                    dicResult["kanji"] += strSurfaceAndFurigana.Split("<Surface>")[1].Split("</Surface>")[0] + " ";
                }
            }

            return dicResult;
        }

        public static string GetFurigana(string encodedWord)
        {
            var jsonString = Fetch.Post(
                    $"{Consts.ARTICLES_URL}/api/japaneseDictionary/yahooFuriganaV1",
                    new Dictionary<string, string>() {
                        {"word", encodedWord},
                        {"yahooAppId", PrivateConsts.YAHOO_API_ID}
                    }
                );

            if (jsonString == "")
            {
                return "";
            }

            var nextResult = JsonSerializer.Deserialize<NextResult>(jsonString);

            if (nextResult.responseType == "success")
            {
                return nextResult.xml;
            }
            return "";
        }

        private class NextResult
        {
            public string responseType { get; set; }
            public string xml { get; set; }
        }

        private string MakeRomaji(string hiragana)
        {
            string result = hiragana;
            var dicH1 = new Dictionary<string, string>() { { "???", "a" }, { "???", "i" }, { "???", "u" }, { "???", "e" }, { "???", "o" }, { "???", "a" }, { "???", "i" }, { "???", "u" }, { "???", "e" }, { "???", "o" }, { "???", "ka" }, { "???", "ki" }, { "???", "ku" }, { "???", "ke" }, { "???", "ko" }, { "???", "sa" }, { "???", "shi" }, { "???", "su" }, { "???", "se" }, { "???", "so" }, { "???", "ta" }, { "???", "chi" }, { "???", "tsu" }, { "???", "te" }, { "???", "to" }, { "???", "na" }, { "???", "ni" }, { "???", "nu" }, { "???", "ne" }, { "???", "no" }, { "???", "ha" }, { "???", "hi" }, { "???", "fu" }, { "???", "he" }, { "???", "ho" }, { "???", "ma" }, { "???", "mi" }, { "???", "mu" }, { "???", "me" }, { "???", "mo" }, { "???", "ya" }, { "???", "yu" }, { "???", "yo" }, { "???", "ra" }, { "???", "ri" }, { "???", "ru" }, { "???", "re" }, { "???", "ro" }, { "???", "wa" }, { "??? ", "i" }, { "???", "e" }, { "???", "wo" }, { "???", "ga" }, { "???", "gi" }, { "???", "gu" }, { "???", "ge" }, { "???", "go" }, { "???", "za" }, { "???", "ji" }, { "???", "zu" }, { "???", "ze" }, { "???", "zo" }, { "???", "da" }, { "???", "ji" }, { "???", "zu" }, { "???", "de" }, { "???", "do" }, { "???", "ba" }, { "???", "bi" }, { "???", "bu" }, { "???", "be" }, { "???", "bo" }, { "???", "pa" }, { "???", "pi" }, { "???", "pu" }, { "???", "pe" }, { "???", "po" }, { "???", "bu" }, { "???", "" }, { "???", "n" } };
            var dicH2 = new Dictionary<string, string>() { { " ??? ", " e " }, { " ??? ", " wa " }, { "??????", "kya" }, { "??????", "kyu" }, { "??????", "kyo" }, { "??????", "sha" }, { "??????", "shu" }, { "??????", "sho" }, { "??????", "cha" }, { "??????", "chu" }, { "??????", "cho" }, { "??????", "nya" }, { "??????", "nyu" }, { "??????", "nyo" }, { "??????", "hya" }, { "??????", "hyu" }, { "??????", "hyo" }, { "??????", "mya" }, { "??????", "myu" }, { "??????", "myo" }, { "??????", "rya" }, { "??????", "ryu" }, { "??????", "ryo" }, { "??????", "gya" }, { "??????", "gyu" }, { "??????", "gyo" }, { "??????", "ja" }, { "??????", "ju" }, { "??????", "jo" }, { "??????", "bya" }, { "??????", "byu" }, { "??????", "byo" }, { "??????", "pya" }, { "??????", "pyu" }, { "??????", "pyo" }, { "??????", "jie" }, { "??????", "chie" }, { "??????", "tei" }, { "??????", "dei" }, { "??????", "deyu" }, { "??????", "fua" }, { "??????", "fui" }, { "??????", "fue" }, { "??????", "fuo" }, { "??????", "bua" }, { "??????", "bui" }, { "??????", "bue" }, { "??????", "buo" }, };

            foreach (KeyValuePair<string, string> kvp in dicH2)
            {
                result = result.Replace(kvp.Key, kvp.Value + " ");
            }

            foreach (KeyValuePair<string, string> kvp in dicH1)
            {
                result = result.Replace(kvp.Key, kvp.Value + " ");
            }
            return result;
        }

        private string ConvertTsu(string romaji)
        {
            string result = romaji;
            var dicTsu = new Dictionary<string, string>() { { "???ch", "t ch" }, { "???ch", "t ch" } };
            var dicTsuSpace = new Dictionary<string, string>() { { "??? ", "???" } };

            foreach (KeyValuePair<string, string> kvp in dicTsu)
            {
                result = result.Replace(kvp.Key, kvp.Value);
            }

            foreach (KeyValuePair<string, string> kvp in dicTsuSpace)
            {
                result = result.Replace(kvp.Key, kvp.Value);
            }

            while (result.IndexOf("???") >= 0)
            {
                var ind = result.IndexOf("???");
                result = result.ChangeCharAt(ind, result[ind + 1] + " ");
            }
            return result;
        }


        private string ConvertSpecialChar(string hiragana)
        {
            string result = hiragana;
            var dic = new Dictionary<string, string>() { { "  ", " " }, { " ???", "???" }, { " ???", "???" }, { " ???", "???" }, { " ???", "???" }, { "??? ", "???" } };
            var dic2 = new Dictionary<string, string>() { { "??? ", "???" }, { "??? ", "???" }, { "??? ", "???" }, { "??? ", "???" }, { "??? ", "???" } };

            foreach (KeyValuePair<string, string> kvp in dic)
            {
                result = result.Replace(kvp.Key, kvp.Value);
            }
            foreach (KeyValuePair<string, string> kvp in dic2)
            {
                result = result.Replace(kvp.Key, kvp.Value);
            }
            return result;
        }


        public async Task<string> MakeEnglish(string kanji)
        {
            string url = @"https://script.google.com/macros/s/AKfycbzybNyMvQkLkgzgtxOE-8Js7dTBnECkj4uN7Q2vDMMPbXMkEoCd5grxM9RTiPstgttMIw/exec?text="
                + kanji + @"&source=ja&target=en";

            using (var client = new HttpClient())
            {
                var result = await client.GetStringAsync(url);
                return result;
            }
        }

        public async Task<Word> TranslateWord(Word word)
        {
            var dicWord = wordManager.GetWordMeaning(word.Kanji);
            if (dicWord.Count > 0)
            {
                word.Hiragana = (string)dicWord["Hiragana"];
                word.English = (string)dicWord["English"];
            }
            else
            {
                var dicHiraganaKanji = MakeHiraganaAndKanji(word.Kanji);
                dicHiraganaKanji["hiragana"] = dicHiraganaKanji["hiragana"].Replace(" ", "");
                word.Hiragana = (word.Kanji == dicHiraganaKanji["hiragana"]) ? "" : dicHiraganaKanji["hiragana"];
                string eng = await MakeEnglish(word.Kanji);
                word.English = eng.ToLower();
            }
            return word;
        }

        public bool Save(DataToBeSaved data)
        {
            if (data.token != PrivateConsts.REGISTER_PASS)
            {
                return false;
            }

            return con.UseTransaction((execUpdate) =>
            {
                try
                {
                    if (!storyManager.UpdateDesc(
                        data.storyDesc.StoryId,
                        data.storyDesc.StoryName,
                        data.storyDesc.Description,
                        execUpdate))
                    {
                        return false;
                    }
                    if (!sentenceManager.DeleteInsertSentences(
                        data.storyDesc.StoryId,
                        data.sentences,
                        execUpdate))
                    {
                        return false;
                    }
                    if (!wordManager.DeleteInsertWords(
                        data.storyDesc.StoryId, data.words,
                        execUpdate))
                    {
                        return false;
                    }
                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }, 60 * 10// ????????????????????????????????????
            );
        }

        public bool SaveAllStories(AllStoriesToBeSaved data)
        {
            if (data.token != PrivateConsts.REGISTER_PASS)
            {
                return false;
            }

            return storyManager.SaveAllStories(data.stories);
        }
    }
}

public static class String
{
    public static string ChangeCharAt(this string str, int index, string newString)
    {
        return str.Remove(index, 1).Insert(index, newString);
    }
}