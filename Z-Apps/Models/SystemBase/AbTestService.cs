using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using static Z_Apps.Controllers.SystemBaseController;

namespace Z_Apps.Models.SystemBase
{
    public class AbTestService
    {
        DBCon con;
        public const double unitNumber = 10000;
        public const double squareRatioMaximumValue = unitNumber * unitNumber;

        public AbTestService()
        {
            con = new DBCon(DBCon.DBType.wiki_db);
        }

        public string GetAbTestKey(GetAbTestKeyParam param)
        {
            // Get records from DB
            var records = GetTestRecords(param.TestName);

            // Choose a key to use this time
            string key = ChooseKey(param, records);

            // Insert the key into DB
            InsertAbTest(param.TestName, key, false);

            return key;
        }

        public string ChooseKey(GetAbTestKeyParam param, IEnumerable<AbTest> records)
        {
            // Get score for each key
            var squareScores = getSquareScores(param, records);

            // Sum up scores
            double totalScore = getTotalScore(squareScores);

            // Modify each value for (int.MaxValue - 1) to be their total value
            var modifiedScores = getModifiedScores(squareScores, totalScore);

            // Choose a key depending on the scores
            return getKey(modifiedScores);
        }

        public Dictionary<string, double> getSquareScores(
            GetAbTestKeyParam param,
            IEnumerable<AbTest> records
        )
        {
            var groupedRecords = records.GroupBy(r => r.Key);

            var keys = param.Keys.Distinct();
            return keys.Select(key =>
                {
                    var recordsForTheKey = groupedRecords
                                            .FirstOrDefault(records => records.Key == key);

                    if (recordsForTheKey == null)
                    {
                        return KeyValuePair.Create(key, squareRatioMaximumValue); // The key is still not registered. So, show it in a high possibility
                    }

                    var counts = recordsForTheKey
                                    .GroupBy(r => r.IsSuccess)
                                    .ToDictionary(kg => kg.Key, kg => kg.Count());

                    var shownCount = counts.ContainsKey(false)
                                        ? counts[false]
                                        : 0;
                    var successCount = counts.ContainsKey(true)
                                        ? counts[true]
                                        : 0;

                    // Start from 1 success to prevent 0% success data from existing
                    shownCount++;
                    successCount++;

                    var successRatio = unitNumber * successCount / shownCount; // calc ratio

                    // Can't exceed maximum value
                    var squareRatio = successRatio * successRatio;
                    if (squareRatio > squareRatioMaximumValue)
                    {
                        squareRatio = squareRatioMaximumValue;
                    }

                    return KeyValuePair.Create(key, squareRatio);
                })
                .ToDictionary(kv => kv.Key, kv => kv.Value);
        }

        public double getTotalScore(Dictionary<string, double> squareScores)
        {
            return squareScores.Aggregate((double)0, (acc, val) => acc + val.Value);
        }

        public void AbTestSuccess(AbTestSuccessParam param)
        {
            Task.Run(async () =>
            {
                await Task.Delay(500);
                InsertAbTest(param.TestName, param.Key, true);

                DeleteOneYearOldData(); // Delete old data here

                EmailService.SendToAdmin(
                    $"Success: {param.TestName} | {param.Key}",
                    $"<h1>AB test succeed!</h1><br/>{param.TestName}<br/>{param.Key}"
                ); // Notify admin
            });
        }

        public Dictionary<string, double> getModifiedScores(
            Dictionary<string, double> squareScores,
            double totalScore
        )
        {
            return squareScores.ToDictionary(kv => kv.Key, kv =>
            {
                var maxValueRatio = (double)(int.MaxValue - 1) / totalScore;
                return kv.Value * maxValueRatio;
            });
        }

        public string getKey(Dictionary<string, double> modifiedScores)
        {
            var randValue = (double)new Random().Next(0, int.MaxValue);
            foreach (var kv in modifiedScores)
            {
                randValue -= kv.Value;
                if (randValue <= 0)
                {
                    // Return chosen key
                    return kv.Key;
                }
            }
            return modifiedScores.Last().Key; // just in case where rounding error happens
        }

        private void InsertAbTest(string TestName, string Key, bool IsSuccess)
        {
            string sql = @"
INSERT INTO ZAppsAbTest (TestName, [Key], IsSuccess, Date)
VALUES (@TestName, @Key, @IsSuccess, GETDATE());
";

            con.ExecuteUpdate(
                sql,
                new Dictionary<string, object[]> {
                    { "@TestName", new object[2] { SqlDbType.NVarChar, TestName } },
                    { "@Key", new object[2] { SqlDbType.NVarChar, Key } },
                    { "@IsSuccess", new object[2] { SqlDbType.Bit, IsSuccess } },
                }
            );
        }

        public IEnumerable<AbTest> GetTestRecords(string TestName)
        {
            string sql = @"
SELECT TestName, [Key], IsSuccess
FROM ZAppsAbTest
WHERE TestName = @TestName;
";

            return con.ExecuteSelect(
                sql,
                new Dictionary<string, object[]> {
                    { "@TestName", new object[2] { SqlDbType.NVarChar, TestName } },
                }
            )
            .Select(r => new AbTest()
            {
                TestName = (string)r["TestName"],
                Key = (string)r["Key"],
                IsSuccess = (bool)r["IsSuccess"],
            });
        }

        public IEnumerable<object> GetTestRecordsWithDate(string TestName)
        {
            string sql = @"
SELECT TestName, [Key], IsSuccess, Date
FROM ZAppsAbTest
WHERE TestName = @TestName;
";

            return con.ExecuteSelect(
                sql,
                new Dictionary<string, object[]> {
                    { "@TestName", new object[2] { SqlDbType.NVarChar, TestName } },
                }
            )
            .Select(r => new
            {
                TestName = (string)r["TestName"],
                Key = (string)r["Key"],
                IsSuccess = (bool)r["IsSuccess"],
                Date = r["Date"]
            });
        }

        private void DeleteOneYearOldData()
        {
            string sql = @"
delete ZAppsAbTest
where Date < DATEADD(year, -3, GETDATE());
";

            con.ExecuteUpdate(sql);
        }

        public IEnumerable<string> GetAllTestName()
        {
            string sql = @"
select distinct TestName
from ZAppsAbTest;
";

            return con.ExecuteSelect(sql)
            .Select(r => (string)r["TestName"]);
        }
    }

    public class AbTest
    {
        public string TestName { get; set; }
        public string Key { get; set; }
        public bool IsSuccess { get; set; }
    }
}

