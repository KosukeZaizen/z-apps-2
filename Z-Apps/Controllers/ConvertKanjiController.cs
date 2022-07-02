using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Z_Apps.Models.StoriesEdit;
using Z_Apps.Util;

namespace Z_Apps.Controllers
{
    [Route("api/[controller]")]
    public class ConvertKanjiController : Controller
    {
        [HttpGet("[action]")]
        public IEnumerable<ConvertedString> Convert(string kanjis)
        {
            string resText = StoriesEditService.GetFurigana(kanjis);

            string[] arrFurigana1 = resText.Split("<Word>");

            string result = "";
            foreach (string str in arrFurigana1)
            {
                if (str.Contains("</Word>"))
                {
                    string strSurfaceAndFurigana = str.Split("<SubWordList>")[0].Split("</Word>")[0];
                    if (strSurfaceAndFurigana.Contains("<Furigana>"))
                    {
                        result += strSurfaceAndFurigana.Split("<Furigana>")[1].Split("</Furigana>")[0];
                    }
                    else
                    {
                        result += strSurfaceAndFurigana.Split("<Surface>")[1].Split("</Surface>")[0];
                    }
                }
            }

            return Enumerable.Range(1, 1).Select(index => new ConvertedString
            {
                ConvertedWord = result,
            });
        }

        public class ConvertedString
        {
            public string ConvertedWord { get; set; }
        }
    }
}
