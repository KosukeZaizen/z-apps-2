using Z_Apps.Models;

namespace UnitTest.UserTest
{
    [TestClass]
    public class UserTest
    {
        [TestMethod]
        public void Level_NoXp()
        {
            var user = new User();
            Assert.AreEqual(1, user.Level);
        }

        [TestMethod]
        public void Level_MinusXp()
        {
            var user1 = new User()
            {
                Xp = -1
            };
            Assert.AreEqual(1, user1.Level);

            var user2 = new User()
            {
                Xp = -1000
            };
            Assert.AreEqual(1, user2.Level);
        }

        [TestMethod]
        public void Level_Xp0()
        {
            var user = new User()
            {
                Xp = 0
            };
            Assert.AreEqual(1, user.Level);
        }

        [TestMethod]
        public void Level_Xp1()
        {
            var user = new User()
            {
                Xp = 1
            };
            Assert.AreEqual(1, user.Level);
        }

        [TestMethod]
        public void Level_1()
        {
            var user = new User()
            {
                Xp = 99
            };
            Assert.AreEqual(1, user.Level);
        }

        [TestMethod]
        public void Level_2()
        {
            var user1 = new User()
            {
                Xp = 100
            };
            Assert.AreEqual(2, user1.Level);

            var user2 = new User()
            {
                Xp = 209
            };
            Assert.AreEqual(2, user2.Level);
        }

        [TestMethod]
        public void Level_3()
        {
            var user1 = new User()
            {
                Xp = 210
            };
            Assert.AreEqual(3, user1.Level);

            var user2 = new User()
            {
                Xp = 330
            };
            Assert.AreEqual(3, user2.Level);
        }

        [TestMethod]
        public void Level_4()
        {
            var user1 = new User()
            {
                Xp = 331
            };
            Assert.AreEqual(4, user1.Level);

            var user2 = new User()
            {
                Xp = 464
            };
            Assert.AreEqual(4, user2.Level);
        }

        [TestMethod]
        public void Level_29to30()
        {
            var user1 = new User()
            {
                Xp = 14863
            };
            Assert.AreEqual(29, user1.Level);

            var user2 = new User()
            {
                Xp = 14864
            };
            Assert.AreEqual(30, user2.Level);
        }

        [TestMethod]
        public void Level_49to50()
        {
            var user1 = new User()
            {
                Xp = 105718
            };
            Assert.AreEqual(49, user1.Level);

            var user2 = new User()
            {
                Xp = 105719
            };
            Assert.AreEqual(50, user2.Level);
        }

        [TestMethod]
        public void Level_50to51()
        {
            var user1 = new User()
            {
                Xp = 116390
            };
            Assert.AreEqual(50, user1.Level);

            var user2 = new User()
            {
                Xp = 116391
            };
            Assert.AreEqual(51, user2.Level);
        }

        [TestMethod]
        public void Level_99to100()
        {
            var user1 = new User()
            {
                Xp = 12526829
            };
            Assert.AreEqual(99, user1.Level);

            var user2 = new User()
            {
                Xp = 12526830
            };
            Assert.AreEqual(100, user2.Level);
        }

        [TestMethod]
        public void Level_100to101()
        {
            var user1 = new User()
            {
                Xp = 13779612
            };
            Assert.AreEqual(100, user1.Level);

            var user2 = new User()
            {
                Xp = 13779613
            };
            Assert.AreEqual(101, user2.Level);
        }

        [TestMethod]
        public void ReverseCheck()
        {
            for (int l = 2; l <= 100; l++)
            {
                var minXp = UserService.GetMinimumXpForTheLevel(l);

                var user1 = new User()
                {
                    Xp = minXp - 1
                };
                Assert.AreEqual(l - 1, user1.Level);

                var user2 = new User()
                {
                    Xp = minXp
                };
                Assert.AreEqual(l, user2.Level);
            }
        }
    }
}