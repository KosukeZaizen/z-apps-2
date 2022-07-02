using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Z_Apps.Models.SystemBase
{
    public class ClientOpeLogManager
    {
        private const int logRemainingDays = 1000;
        private readonly DBCon con;
        public ClientOpeLogManager(DBCon con)
        {
            this.con = con;
        }

        public bool InsertLog(ClientOpeLog log)
        {
            var wikiCon = new DBCon(DBCon.DBType.wiki_db);

            //SQL文作成
            string sql = @"
insert into ZAppsClientOpeLog(time, url, operationName, userId, parameters)
values (@time, @url, @operationName, @userId, @parameters);
";

            bool result = wikiCon.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                    { "@time", new object[2] { SqlDbType.DateTime, log.time } },
                    { "@url", new object[2] { SqlDbType.VarChar, log.url } },
                    { "@operationName", new object[2] { SqlDbType.VarChar, log.operationName } },
                    { "@userId", new object[2] { SqlDbType.VarChar, log.userId } },
                    { "@parameters", new object[2] { SqlDbType.VarChar, log.parameters } }
                });

            if (!result)
            {
                return false;
            }
            return true;
        }

        public IEnumerable<ClientOpeLog> GetOpeLogs()
        {
            var wikiCon = new DBCon(DBCon.DBType.wiki_db);

            //SQL文作成
            string sql = $@"
 SELECT time
      ,url
      ,operationName
      ,userId
      ,parameters
  FROM ZAppsClientOpeLog
  where time > CONVERT(date, getdate()-{logRemainingDays})
  and not url like '%localhost%'
  order by time desc
";

            var dics = wikiCon.ExecuteSelect(sql, null);

            var result = new List<ClientOpeLog>();
            foreach (var dic in dics)
            {
                var record = new ClientOpeLog();
                record.time = (DateTime)dic["time"];
                record.url = (string)dic["url"];
                record.operationName = (string)dic["operationName"];
                record.userId = (string)dic["userId"];
                record.parameters = (string)dic["parameters"];

                result.Add(record);
            }
            return result;
        }

        public void DeleteOldLogs()
        {
            var logService = new ClientLogService(con);
            try
            {
                var wikiCon = new DBCon(DBCon.DBType.wiki_db);

                //SQL文作成
                string sql = $@"
delete from ZAppsClientOpeLog
where url like 'https://localhost%'
or time < CONVERT(date, getdate()-{logRemainingDays});
";

                wikiCon.ExecuteUpdate(sql, null, 60 * 60 * 2);// タイムアウト２時間

                logService.RegisterLog(new ClientOpeLog()
                {
                    url = "wrBatch",
                    operationName = "finish to delete old OpeLog",
                    userId = "wrBatch"
                });
            }
            catch (Exception ex)
            {
                logService.RegisterLog(new ClientOpeLog()
                {
                    url = "wrBatch",
                    operationName = "DeleteOldLogs error",
                    userId = "wrBatch",
                    parameters = "Message: " + ex.Message + " StackTrace: " + ex.StackTrace
                });
            }
        }

        public void DeleteAdminLogs()
        {
            var logService = new ClientLogService(con);
            try
            {
                var wikiCon = new DBCon(DBCon.DBType.wiki_db);

                var clientManager = new ClientManager(con);
                var allClients = clientManager.GetAllClients();

                foreach (var client in allClients)
                {
                    if (client.isAdmin == true)
                    {
                        string sql = @"
delete from ZAppsClientOpeLog
where userId like @userId;
";

                        wikiCon.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                            { "@userId", new object[2] { SqlDbType.VarChar, client.userId } },
                        }, 60 * 60 * 2);// タイムアウト２時間
                    }
                }

                logService.RegisterLog(new ClientOpeLog()
                {
                    url = "wrBatch",
                    operationName = "finish to delete Admin OpeLog",
                    userId = "wrBatch"
                });
            }
            catch (Exception ex)
            {
                logService.RegisterLog(new ClientOpeLog()
                {
                    url = "wrBatch",
                    operationName = "DeleteAdminLogs error",
                    userId = "wrBatch",
                    parameters = "Message: " + ex.Message + " StackTrace: " + ex.StackTrace
                });
            }
        }

        public void SortFolktales()
        {
            var logService = new ClientLogService(con);
            try
            {
                var wikiCon = new DBCon(DBCon.DBType.wiki_db);

                var dicYouTubeClicks = wikiCon.ExecuteSelect(@"
select url, count(*) as cnt from
(
    select url, operationName, parameters
    from ZAppsClientOpeLog
    where url like 'https://www.lingual-ninja.com/folktales/%'
) as tmp
where operationName = 'click YouTube channel'
and parameters not like '%Googlebot%'
group by url;
", null, 60 * 60 * 2);

                var youTubeClicks = dicYouTubeClicks.Select(
                    dic => new UrlCount()
                    {
                        url = removeUrlParams((string)dic["url"]),
                        cnt = (int)dic["cnt"]
                    });

                var dicPageVisit = wikiCon.ExecuteSelect(@"
select url, count(*) as cnt from
(
    select url, operationName, parameters
    from ZAppsClientOpeLog
    where url like 'https://www.lingual-ninja.com/folktales/%'
) as tmp
where
(operationName like 'Came from%'
or operationName = 'change page')
and parameters not like '%Googlebot%'
group by url;
", null, 60 * 60 * 2);

                var pageVisitors = dicPageVisit.Select(
                    dic => new UrlCount()
                    {
                        url = removeUrlParams((string)dic["url"]),
                        cnt = (int)dic["cnt"]
                    });

                var dicStoryNames = con.ExecuteSelect(@"
select StoryName from tblStoryMst
where Released = 1;
", null);

                var infoForLog = "";
                dicStoryNames.ForEach(dic =>
                {
                    var url = (string)dic["StoryName"];
                    var youtubeCnt = youTubeClicks
                                        .Where(c => c.url == $"https://www.lingual-ninja.com/folktales/{url}")
                                        .Select(c => c.cnt)
                                        .Sum();
                    var visitorsCnt = pageVisitors
                                        .Where(c => c.url == $"https://www.lingual-ninja.com/folktales/{url}")
                                        .Select(c => c.cnt)
                                        .Sum();

                    var youtubeRatePoint =
                            visitorsCnt == 0
                                ? 0
                                : 1000 * youtubeCnt / visitorsCnt;

                    con.ExecuteUpdate(@"
UPDATE tblStoryMst
SET    [Order] = @youtubeRatePoint
WHERE  StoryName = @url;
                    ", new Dictionary<string, object[]> {
                            { "@youtubeRatePoint", new object[2] { SqlDbType.Int, youtubeRatePoint } },
                            { "@url", new object[2] { SqlDbType.NVarChar, url } },
                        });

                    infoForLog += $"url:{url} YouTubeClick:{youtubeCnt} Visitors:{visitorsCnt}, ";
                });

                logService.RegisterLog(new ClientOpeLog()
                {
                    url = "wrBatch",
                    operationName = "finish to sort folktales",
                    userId = "wrBatch",
                    parameters = infoForLog,
                });
            }
            catch (Exception ex)
            {
                logService.RegisterLog(new ClientOpeLog()
                {
                    url = "wrBatch",
                    operationName = "SortFolktales error",
                    userId = "wrBatch",
                    parameters = "Message: " + ex.Message + " StackTrace: " + ex.StackTrace
                });
            }
        }

        private string removeUrlParams(string url)
        {
            return url.Split("?")[0].Split("#")[0];
        }
    }
}

public class UrlCount
{
    public string url { get; set; }
    public int cnt { get; set; }
}