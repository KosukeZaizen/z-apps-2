using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Z_Apps.Models.VocabList
{
    public class VocabMergedGenreManager
    {
        private readonly DBCon Con;
        public VocabMergedGenreManager(DBCon con)
        {
            Con = con;
        }

        public IEnumerable<VocabMergedGenre> GetAllMergedGenres()
        {
            //SQL文作成
            string sql = @"
select *
from tblVocabMergedGenreMst
order by [order]
;";

            return Con
                    .ExecuteSelect(sql, null)
                    .Select((g, i) => new VocabMergedGenre()
                    {
                        genreId = (int)g["genreId"],
                        genreName = (string)g["genreName"],
                        youtube =
                            g["youtube"] != null
                                ? (string)g["youtube"]
                                : "",
                        order = i + 1,
                        released = (bool)g["released"],
                    });
        }

        public VocabMergedGenre GetVocabMergedGenre(string genreName)
        {
            //SQL文作成
            string sql = @"
select *
from tblVocabMergedGenreMst
where genreName Like @genreName
;";

            //List<Dictionary<string, Object>>型で取得
            var VocabMergedGenre = Con.ExecuteSelect(sql, new Dictionary<string, object[]> {
                { "@genreName", new object[2] { SqlDbType.NChar, genreName } }
            })
            .FirstOrDefault();

            if (VocabMergedGenre == null)
            {
                // 1件もデータがなければ、
                // フロントから不正なパラメータが来ている可能性があるためエラー
                throw new Exception();
            }


            return new VocabMergedGenre()
            {
                genreId = (int)VocabMergedGenre["genreId"],
                genreName = (string)VocabMergedGenre["genreName"],
                youtube =
                    VocabMergedGenre["youtube"] != null
                        ? (string)VocabMergedGenre["youtube"]
                        : "",
                order = (int)VocabMergedGenre["order"],
                released = (bool)VocabMergedGenre["released"],
            };
        }

        public bool SaveVocabMergedGenres(IEnumerable<VocabMergedGenre> genres)
        {
            return Con.UseTransaction((execUpdate) =>
            {
                try
                {
                    string deleteSql = "delete tblVocabMergedGenreMst;";
                    execUpdate(deleteSql, null);

                    int i = 1;
                    foreach (var genre in genres.OrderBy(g => g.order))
                    {
                        string insertSql = @"
insert into tblVocabMergedGenreMst
    (genreId,genreName,youtube,[order],released)
values
    (@genreId,@genreName,@youtube,@order,@released)
;";
                        var resultCount = execUpdate(insertSql, new Dictionary<string, object[]> {
                            { "@genreId", new object[2] { SqlDbType.Int, genre.genreId } },
                            { "@genreName", new object[2] { SqlDbType.NVarChar, genre.genreName } },
                            { "@youtube", new object[2] { SqlDbType.NVarChar, genre.youtube } },
                            { "@order", new object[2] { SqlDbType.Int, i } },
                            { "@released", new object[2] { SqlDbType.Bit, genre.released } },
                        });

                        if (resultCount != 1)
                        {
                            return false;
                        }
                        i++;
                    }
                    return true;
                }
                catch (Exception ex)
                {
                    ErrorLog.InsertErrorLog(ex.ToString());
                }
                return false;
            });
        }
    }
}
