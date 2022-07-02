using Z_Apps.Models;

namespace UnitTest.Auth
{
    [TestClass]
    public class UserTest
    {
        [TestMethod]
        public void Level_NoExp()
        {
            var user = new User();
            Assert.AreEqual(1, user.Level);
        }

        [TestMethod]
        public void Level_MinusExp()
        {
            var user1 = new User()
            {
                Exp = -1
            };
            Assert.AreEqual(1, user1.Level);

            var user2 = new User()
            {
                Exp = -1000
            };
            Assert.AreEqual(1, user2.Level);
        }

        [TestMethod]
        public void Level_Exp0()
        {
            var user = new User()
            {
                Exp = 0
            };
            Assert.AreEqual(1, user.Level);
        }

        [TestMethod]
        public void Level_Exp1()
        {
            var user = new User()
            {
                Exp = 1
            };
            Assert.AreEqual(1, user.Level);
        }

        [TestMethod]
        public void Level_1()
        {
            var user = new User()
            {
                Exp = 99
            };
            Assert.AreEqual(1, user.Level);
        }

        [TestMethod]
        public void Level_2()
        {
            var user1 = new User()
            {
                Exp = 100
            };
            Assert.AreEqual(2, user1.Level);

            var user2 = new User()
            {
                Exp = 209
            };
            Assert.AreEqual(2, user2.Level);
        }

        [TestMethod]
        public void Level_3()
        {
            var user1 = new User()
            {
                Exp = 210
            };
            Assert.AreEqual(3, user1.Level);

            var user2 = new User()
            {
                Exp = 330
            };
            Assert.AreEqual(3, user2.Level);
        }

        [TestMethod]
        public void Level_4()
        {
            var user1 = new User()
            {
                Exp = 331
            };
            Assert.AreEqual(4, user1.Level);

            var user2 = new User()
            {
                Exp = 464
            };
            Assert.AreEqual(4, user2.Level);
        }

        [TestMethod]
        public void Level_29to30()
        {
            var user1 = new User()
            {
                Exp = 14863
            };
            Assert.AreEqual(29, user1.Level);

            var user2 = new User()
            {
                Exp = 14864
            };
            Assert.AreEqual(30, user2.Level);
        }

        [TestMethod]
        public void Level_49to50()
        {
            var user1 = new User()
            {
                Exp = 105718
            };
            Assert.AreEqual(49, user1.Level);

            var user2 = new User()
            {
                Exp = 105719
            };
            Assert.AreEqual(50, user2.Level);
        }

        [TestMethod]
        public void Level_50to51()
        {
            var user1 = new User()
            {
                Exp = 116390
            };
            Assert.AreEqual(50, user1.Level);

            var user2 = new User()
            {
                Exp = 116391
            };
            Assert.AreEqual(51, user2.Level);
        }

        [TestMethod]
        public void Level_99to100()
        {
            var user1 = new User()
            {
                Exp = 12526829
            };
            Assert.AreEqual(99, user1.Level);

            var user2 = new User()
            {
                Exp = 12526830
            };
            Assert.AreEqual(100, user2.Level);
        }

        [TestMethod]
        public void Level_100to101()
        {
            var user1 = new User()
            {
                Exp = 13779612
            };
            Assert.AreEqual(100, user1.Level);

            var user2 = new User()
            {
                Exp = 13779613
            };
            Assert.AreEqual(101, user2.Level);
        }

        [TestMethod]
        public void ReverseCheck()
        {
            for (int l = 2; l <= 100; l++)
            {
                var minExp = UserService.GetMinimumExpForTheLevel(l);

                var user1 = new User()
                {
                    Exp = minExp - 1
                };
                Assert.AreEqual(l - 1, user1.Level);

                var user2 = new User()
                {
                    Exp = minExp
                };
                Assert.AreEqual(l, user2.Level);
            }
        }
    }
}