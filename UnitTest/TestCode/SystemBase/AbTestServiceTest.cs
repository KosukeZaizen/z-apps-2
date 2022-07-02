using System.Collections.Generic;
using System.Text.Json;
using Z_Apps.Models.SystemBase;
using static Z_Apps.Controllers.SystemBaseController;

namespace UnitTest.SystemBase
{
    [TestClass]
    public class AbTestServiceTest
    {
        AbTestService service;
        const double billion = 100000000;
        const double tenThousand = 10000;

        public AbTestServiceTest()
        {
            service = new AbTestService();
        }

        [TestMethod]
        public void StillNoRecord_OneKey()
        {
            string TestName = "unit-test";
            string[] Keys = new string[] { "key-1" };

            var param = new GetAbTestKeyParam()
            {
                TestName = TestName,
                Keys = Keys
            };

            var records = new AbTest[] { };

            var actual = service.getSquareScores(param, records); // execute

            var expected = Keys
                .Select(key => KeyValuePair.Create(key, billion))
                .ToDictionary(kv => kv.Key, kv => kv.Value);

            Assert.AreEqual(
                JsonSerializer.Serialize(expected),
                JsonSerializer.Serialize(actual)
            );

            var totalScore = service.getTotalScore(actual);
            Assert.AreEqual(billion, totalScore);

            var modifiedScores = service.getModifiedScores(actual, totalScore);
            var modifiedTotal = modifiedScores.Aggregate(0.0, (acc, kv) => acc + kv.Value);
            Assert.IsTrue((double)(int.MaxValue - 1) - modifiedTotal < 0.00001);

            var results = new List<string>();
            for (int i = 0; i < 10000; i++)
            {
                var key = service.getKey(modifiedScores);
                results.Add(key);
            }
            Assert.IsTrue(results.All(key => key == Keys[0]));
        }

        [TestMethod]
        public void StillNoRecord_TwoKeys()
        {
            string TestName = "unit-test";
            string[] Keys = new string[] { "key-1", "key-2" };

            var param = new GetAbTestKeyParam()
            {
                TestName = TestName,
                Keys = Keys
            };

            var records = new AbTest[] { };

            var actual = service.getSquareScores(param, records); // execute

            var expected = Keys
                .Select(key => KeyValuePair.Create(key, billion))
                .ToDictionary(kv => kv.Key, kv => kv.Value);

            Assert.AreEqual(
                JsonSerializer.Serialize(expected),
                JsonSerializer.Serialize(actual)
            );

            var totalScore = service.getTotalScore(actual);
            Assert.AreEqual(2 * billion, totalScore);

            var modifiedScores = service.getModifiedScores(actual, totalScore);
            var modifiedTotal = modifiedScores.Aggregate(0.0, (acc, kv) => acc + kv.Value);
            Assert.IsTrue((double)(int.MaxValue - 1) - modifiedTotal < 0.00001);

            var results = new List<string>();
            for (int i = 0; i < 10000; i++)
            {
                var key = service.getKey(modifiedScores);
                results.Add(key);
            }
            var ratio = (double)results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[1]);
            Assert.IsTrue(ratio > 0.7 && ratio < 1.3);
        }

        [TestMethod]
        public void OneSuccessRecord_NormallyImpossible()
        {
            // This test case doesn't normally happen because "success" cannot happen without "shown".
            string TestName = "unit-test";
            string[] Keys = new string[] { "key-1", "key-2", "key-3" };

            var param = new GetAbTestKeyParam()
            {
                TestName = TestName,
                Keys = Keys
            };

            var records = new AbTest[] {
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[0],
                    IsSuccess = true,
                }
            };

            var actual = service.getSquareScores(param, records); // execute

            var expected = Keys
                .Select(key => KeyValuePair.Create(key, billion))
                .ToDictionary(kv => kv.Key, kv => kv.Value);

            Assert.AreEqual(
                JsonSerializer.Serialize(expected),
                JsonSerializer.Serialize(actual)
            );

            var totalScore = service.getTotalScore(actual);
            Assert.AreEqual(3 * billion, totalScore);

            var modifiedScores = service.getModifiedScores(actual, totalScore);
            var modifiedTotal = modifiedScores.Aggregate(0.0, (acc, kv) => acc + kv.Value);
            Assert.IsTrue((double)(int.MaxValue - 1) - modifiedTotal < 0.00001);

            var results = new List<string>();
            for (int i = 0; i < 10000; i++)
            {
                var key = service.getKey(modifiedScores);
                results.Add(key);
            }

            var ratio1 = (double)results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[1]);
            Assert.IsTrue(ratio1 > 0.7 && ratio1 < 1.3);

            var ratio2 = (double)results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[2]);
            Assert.IsTrue(ratio2 > 0.7 && ratio2 < 1.3);
        }

        [TestMethod]
        public void OneShownRecord()
        {
            string TestName = "unit-test";
            string[] Keys = new string[] { "key-1", "key-2", "key-3" };

            var param = new GetAbTestKeyParam()
            {
                TestName = TestName,
                Keys = Keys
            };

            var records = new AbTest[] {
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[1],
                    IsSuccess = false,
                }
            };

            var actual = service.getSquareScores(param, records); // execute

            var expected = Keys
                .Select(key => KeyValuePair.Create(key, billion))
                .ToDictionary(kv => kv.Key, kv => kv.Value);
            expected[Keys[1]] = 0.5 * 0.5 * billion;

            Assert.AreEqual(
                JsonSerializer.Serialize(expected),
                JsonSerializer.Serialize(actual)
            );

            var totalScore = service.getTotalScore(actual);
            Assert.AreEqual(2.25 * billion, totalScore);

            var modifiedScores = service.getModifiedScores(actual, totalScore);
            var modifiedTotal = modifiedScores.Aggregate(0.0, (acc, kv) => acc + kv.Value);
            Assert.IsTrue((double)(int.MaxValue - 1) - modifiedTotal < 0.00001);

            var results = new List<string>();
            for (int i = 0; i < 15000; i++)
            {
                var key = service.getKey(modifiedScores);
                results.Add(key);
            }

            var ratio1 = (double)results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[1]);
            Assert.IsTrue(ratio1 > 3.7 && ratio1 < 4.3);

            var ratio2 = (double)results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[2]);
            Assert.IsTrue(ratio2 > 0.7 && ratio2 < 1.3);
        }

        [TestMethod]
        public void OneSuccessAndOneShownRecord()
        {
            string TestName = "unit-test";
            string[] Keys = new string[] { "key-1", "key-2", "key-3" };

            var param = new GetAbTestKeyParam()
            {
                TestName = TestName,
                Keys = Keys
            };

            var records = new AbTest[] {
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = true,
                }
            };

            var actual = service.getSquareScores(param, records); // execute

            var expected = Keys
                .Select(key => KeyValuePair.Create(key, billion))
                .ToDictionary(kv => kv.Key, kv => kv.Value);

            Assert.AreEqual(
                JsonSerializer.Serialize(expected),
                JsonSerializer.Serialize(actual)
            );

            var totalScore = service.getTotalScore(actual);
            Assert.AreEqual(3 * billion, totalScore);

            var modifiedScores = service.getModifiedScores(actual, totalScore);
            var modifiedTotal = modifiedScores.Aggregate(0.0, (acc, kv) => acc + kv.Value);
            Assert.IsTrue((double)(int.MaxValue - 1) - modifiedTotal < 0.00001);

            var results = new List<string>();
            for (int i = 0; i < 10000; i++)
            {
                var key = service.getKey(modifiedScores);
                results.Add(key);
            }

            var ratio1 = (double)results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[1]);
            Assert.IsTrue(ratio1 > 0.7 && ratio1 < 1.3);

            var ratio2 = (double)results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[2]);
            Assert.IsTrue(ratio2 > 0.7 && ratio2 < 1.3);
        }

        [TestMethod]
        public void OneSuccessAndTwoShownRecord()
        {
            string TestName = "unit-test";
            string[] Keys = new string[] { "key-1", "key-2", "key-3" };

            var param = new GetAbTestKeyParam()
            {
                TestName = TestName,
                Keys = Keys
            };

            var records = new AbTest[] {
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = true,
                }
            };

            var actual = service.getSquareScores(param, records); // execute

            var expected = Keys
                .Select(key => KeyValuePair.Create(key, billion))
                .ToDictionary(kv => kv.Key, kv => kv.Value);
            expected[Keys[2]] = Math.Pow(tenThousand * 2 / 3, 2);

            Assert.AreEqual(
                JsonSerializer.Serialize(expected),
                JsonSerializer.Serialize(actual)
            );

            var totalScore = service.getTotalScore(actual);
            Assert.AreEqual(
                2 * billion + Math.Pow(tenThousand * 2 / 3, 2),
                totalScore
            );

            var modifiedScores = service.getModifiedScores(actual, totalScore);
            var modifiedTotal = modifiedScores.Aggregate(0.0, (acc, kv) => acc + kv.Value);
            Assert.IsTrue((double)(int.MaxValue - 1) - modifiedTotal < 0.00001);

            var results = new List<string>();
            for (int i = 0; i < 10000; i++)
            {
                var key = service.getKey(modifiedScores);
                results.Add(key);
            }

            var ratio1 = (double)results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[1]);
            Assert.IsTrue(ratio1 > 0.7 && ratio1 < 1.3);

            var ratio2 = ((double)4 / 9) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[2]);
            Assert.IsTrue(ratio2 > 0.7 && ratio2 < 1.3);
        }

        [TestMethod]
        public void Compound1()
        {
            string TestName = "unit-test";
            string[] Keys = new string[] { "key-1", "key-2", "key-3" };

            var param = new GetAbTestKeyParam()
            {
                TestName = TestName,
                Keys = Keys
            };

            var records = new AbTest[] {
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[1],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = true,
                }
            };

            var actual = service.getSquareScores(param, records); // execute

            var expected = Keys
                .Select(key => KeyValuePair.Create(key, billion))
                .ToDictionary(kv => kv.Key, kv => kv.Value);
            expected[Keys[1]] = 0.5 * 0.5 * billion;
            expected[Keys[2]] = Math.Pow(tenThousand * 2 / 3, 2);

            Assert.AreEqual(
                JsonSerializer.Serialize(expected),
                JsonSerializer.Serialize(actual)
            );

            var totalScore = service.getTotalScore(actual);
            Assert.AreEqual(
                1 * billion + 0.5 * 0.5 * billion + Math.Pow(tenThousand * 2 / 3, 2),
                totalScore
            );

            var modifiedScores = service.getModifiedScores(actual, totalScore);
            var modifiedTotal = modifiedScores.Aggregate(0.0, (acc, kv) => acc + kv.Value);
            Assert.IsTrue((double)(int.MaxValue - 1) - modifiedTotal < 0.00001);

            var results = new List<string>();
            for (int i = 0; i < 10000; i++)
            {
                var key = service.getKey(modifiedScores);
                results.Add(key);
            }

            var ratio1 = (1.0 / 4) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[1]);
            Assert.IsTrue(ratio1 > 0.7 && ratio1 < 1.3);

            var ratio2 = (4.0 / 9) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[2]);
            Assert.IsTrue(ratio2 > 0.7 && ratio2 < 1.3);
        }

        [TestMethod]
        public void Compound2()
        {
            string TestName = "unit-test";
            string[] Keys = new string[] { "key-1", "key-2", "key-3", "key-4" };

            var param = new GetAbTestKeyParam()
            {
                TestName = TestName,
                Keys = Keys
            };

            var records = new AbTest[] {
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[3],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = true,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[1],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[3],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[3],
                    IsSuccess = false,
                }
            };

            var actual = service.getSquareScores(param, records); // execute

            var expected = Keys
                .Select(key => KeyValuePair.Create(key, billion))
                .ToDictionary(kv => kv.Key, kv => kv.Value);
            expected[Keys[1]] = 0.5 * 0.5 * billion;
            expected[Keys[2]] = Math.Pow(tenThousand * 2 / 3, 2);
            expected[Keys[3]] = Math.Pow(tenThousand / 4, 2);

            Assert.AreEqual(
                JsonSerializer.Serialize(expected),
                JsonSerializer.Serialize(actual)
            );

            var totalScore = service.getTotalScore(actual);
            Assert.AreEqual(
                0.5 * 0.5 * billion + Math.Pow(tenThousand * 2 / 3, 2) + Math.Pow(tenThousand / 4, 2) + billion,
                totalScore
            );

            var modifiedScores = service.getModifiedScores(actual, totalScore);
            var modifiedTotal = modifiedScores.Aggregate(0.0, (acc, kv) => acc + kv.Value);
            Assert.IsTrue((double)(int.MaxValue - 1) - modifiedTotal < 0.00001);

            var results = new List<string>();
            for (int i = 0; i < 10000; i++)
            {
                var key = service.getKey(modifiedScores);
                results.Add(key);
            }

            var ratio1 = (1.0 / 4) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[1]);
            Assert.IsTrue(ratio1 > 0.7 && ratio1 < 1.3);

            var ratio2 = (4.0 / 9) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[2]);
            Assert.IsTrue(ratio2 > 0.7 && ratio2 < 1.3);

            var ratio3 = (1.0 / 16) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[3]);
            Assert.IsTrue(ratio3 > 0.7 && ratio3 < 1.3);
        }

        [TestMethod]
        public void ALotOfRecords()
        {
            string TestName = "unit-test";
            string[] Keys = new string[] { "key-1", "key-2", "key-3" };

            var param = new GetAbTestKeyParam()
            {
                TestName = TestName,
                Keys = Keys
            };

            var records = new List<AbTest>();

            for (var i = 1; i < 100000; i++)
            {
                records.Add(new AbTest()
                {
                    TestName = TestName,
                    Key = Keys[0],
                    IsSuccess = false,
                });
                records.Add(new AbTest()
                {
                    TestName = TestName,
                    Key = Keys[1],
                    IsSuccess = false,
                });
                records.Add(new AbTest()
                {
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = false,
                });

                if (i % 100 == 0)
                {
                    records.Add(new AbTest()
                    {
                        TestName = TestName,
                        Key = Keys[0],
                        IsSuccess = true,
                    });
                }

                if (i % 500 == 0)
                {
                    records.Add(new AbTest()
                    {
                        TestName = TestName,
                        Key = Keys[1],
                        IsSuccess = true,
                    });
                }

                if (i % 1000 == 0)
                {
                    records.Add(new AbTest()
                    {
                        TestName = TestName,
                        Key = Keys[2],
                        IsSuccess = true,
                    });
                }
            }

            var actual = service.getSquareScores(param, records); // execute

            var expected = Keys
                .Select(key => KeyValuePair.Create(key, billion))
                .ToDictionary(kv => kv.Key, kv => kv.Value);
            expected[Keys[0]] = Math.Pow(tenThousand / 100, 2);
            expected[Keys[1]] = Math.Pow(tenThousand / 500, 2);
            expected[Keys[2]] = Math.Pow(tenThousand / 1000, 2);

            Assert.AreEqual(
                JsonSerializer.Serialize(expected),
                JsonSerializer.Serialize(actual)
            );

            var totalScore = service.getTotalScore(actual);
            Assert.AreEqual(
                Math.Pow(tenThousand / 100, 2) + Math.Pow(tenThousand / 500, 2) + Math.Pow(tenThousand / 1000, 2),
                totalScore
            );

            var modifiedScores = service.getModifiedScores(actual, totalScore);
            var modifiedTotal = modifiedScores.Aggregate(0.0, (acc, kv) => acc + kv.Value);
            Assert.IsTrue((double)(int.MaxValue - 1) - modifiedTotal < 0.00001);

            var results = new List<string>();
            for (int i = 0; i < 12000; i++)
            {
                var key = service.getKey(modifiedScores);
                results.Add(key);
            }

            var ratio1 = (1.0 / 25) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[1]);
            Assert.IsTrue(ratio1 > 0.7 && ratio1 < 1.3);

            var ratio2 = (1.0 / 100) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[2]);
            Assert.IsTrue(ratio2 > 0.7 && ratio2 < 1.3);
        }

        [TestMethod]
        public void ChooseKey_StillNoRecord_OneKey()
        {
            string TestName = "unit-test";
            string[] Keys = new string[] { "key-1" };

            var param = new GetAbTestKeyParam()
            {
                TestName = TestName,
                Keys = Keys
            };

            var records = new AbTest[] { };

            var results = new List<string>();
            for (int i = 0; i < 10000; i++)
            {
                var key = service.ChooseKey(param, records); // execute
                results.Add(key);
            }
            Assert.IsTrue(results.All(key => key == Keys[0]));
        }

        [TestMethod]
        public void ChooseKey_Compound()
        {
            string TestName = "unit-test";
            string[] Keys = new string[] { "key-1", "key-2", "key-3", "key-4" };

            var param = new GetAbTestKeyParam()
            {
                TestName = TestName,
                Keys = Keys
            };

            var records = new AbTest[] {
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[3],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = true,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[1],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[3],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[3],
                    IsSuccess = false,
                }
            };

            var results = new List<string>();
            for (int i = 0; i < 10000; i++)
            {
                var key = service.ChooseKey(param, records); // execute
                results.Add(key);
            }

            var ratio1 = (1.0 / 4) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[1]);
            Assert.IsTrue(ratio1 > 0.7 && ratio1 < 1.3);

            var ratio2 = (4.0 / 9) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[2]);
            Assert.IsTrue(ratio2 > 0.7 && ratio2 < 1.3);

            var ratio3 = (1.0 / 16) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[3]);
            Assert.IsTrue(ratio3 > 0.7 && ratio3 < 1.3);
        }

        [TestMethod]
        public void ChooseKey_ALotOfKeys()
        {
            string TestName = "unit-test";
            var lstKeys = new List<string>();
            for (int i = 1; i <= 100; i++)
            {
                lstKeys.Add($"key-${i}");
            }

            var Keys = lstKeys.ToArray();
            var param = new GetAbTestKeyParam()
            {
                TestName = TestName,
                Keys = Keys
            };

            var lstRecords = new List<AbTest> {
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[3],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[2],
                    IsSuccess = true,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[1],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[3],
                    IsSuccess = false,
                },
                new AbTest(){
                    TestName = TestName,
                    Key = Keys[3],
                    IsSuccess = false,
                }
            };

            for (int i = 4; i <= 99; i++)
            {
                if (!lstRecords.Any(r => r.Key == (Keys[i] ?? "")))
                {
                    lstRecords.Add(new AbTest()
                    {
                        TestName = TestName,
                        Key = Keys[i],
                        IsSuccess = false,
                    });
                    lstRecords.Add(new AbTest()
                    {
                        TestName = TestName,
                        Key = Keys[i],
                        IsSuccess = false,
                    });
                    lstRecords.Add(new AbTest()
                    {
                        TestName = TestName,
                        Key = Keys[i],
                        IsSuccess = false,
                    });
                }
            }

            var records = lstRecords.ToArray();

            var squareScores = service.getSquareScores(param, records);
            double totalScore = service.getTotalScore(squareScores);
            var modifiedScores = service.getModifiedScores(squareScores, totalScore);

            var results = new List<string>();
            for (int i = 0; i < 15000; i++)
            {
                var key = service.getKey(modifiedScores);
                results.Add(key);
            }

            var ratio1 = (1.0 / 4) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[1]);
            Assert.IsTrue(ratio1 > 0.7 && ratio1 < 1.3);

            var ratio2 = (4.0 / 9) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[2]);
            Assert.IsTrue(ratio2 > 0.7 && ratio2 < 1.3);

            var ratio3 = (1.0 / 16) * results.Count(r => r == Keys[0]) / results.Count(r => r == Keys[3]);
            Assert.IsTrue(ratio3 > 0.7 && ratio3 < 1.3);
        }
    }
}