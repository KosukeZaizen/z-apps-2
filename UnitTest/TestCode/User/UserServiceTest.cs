using Z_Apps.Models;

namespace UnitTest.UserTest
{
    [TestClass]
    public class UserServiceTest
    {
        [TestMethod]
        public void Validate()
        {
            var userService = new UserService();

            Assert.AreEqual(userService.Validate("", "", ""), "Your username must contain between 1 and 20 characters.");

            Assert.AreEqual(userService.Validate("", "test@gmail.com", ""), "Your username must contain between 1 and 20 characters.");

            Assert.AreEqual(userService.Validate("a", "", ""), "Please enter a valid email address.");

            Assert.AreEqual(userService.Validate("12345678901234567890", "", ""), "Please enter a valid email address.");

            Assert.AreEqual(userService.Validate("123456789012345678901", "", ""), "Your username must contain between 1 and 20 characters.");

            Assert.AreEqual(userService.Validate("a", "yoshida.shigeru@gmail.com", ""), "Your password must contain between 8 and 60 characters.");

            Assert.AreEqual(userService.Validate("Taro125", "yoshida-shigeru1@gmail.com", "ryuadsa-d"), "Your password must contain at least one number and one letter.");

            Assert.AreEqual(userService.Validate("Taro125", "yoshida-shigeru1@gmail.com", "ryuadsa-d2"), null);

            Assert.AreEqual(userService.Validate("Taro125", "yoshida-shigeru1@gmail.com", "ryuadsa-dA"), null);

            // Shortest input
            Assert.AreEqual(userService.Validate("a", "a@aa.aa", "Aaaaaaaa"), null);

            // Too short email (without a period)
            Assert.AreEqual(userService.Validate("a", "a@a", "Aaaaaaaa"),
            "Please enter a valid email address.");

            // Too short password
            Assert.AreEqual(userService.Validate("a", "a@aa.aa", "Aaaaaaa"),
            "Your password must contain between 8 and 60 characters.");

            // Longest input
            Assert.AreEqual(userService.Validate("12345678901234567890",
                "testtesttesttesttesttesttesttesttesttest@gmail.com",
                "a23456789012345678901234567890123456789012345678901234567890"), null);

            // Too long name
            Assert.AreEqual(userService.Validate("12345678901234567890a",
                "testtesttesttesttesttesttesttesttesttest@gmail.com",
                "a23456789012345678901234567890123456789012345678901234567890"),
                "Your username must contain between 1 and 20 characters.");

            // Too long name
            Assert.AreEqual(userService.Validate("12345678901234567890a",
                "testtesttesttesttesttesttesttesttesttest@gmail.com",
                "a23456789012345678901234567890123456789012345678901234567890"),
                "Your username must contain between 1 and 20 characters.");

            //Too long email
            Assert.AreEqual(userService.Validate("12345678901234567890",
            "testtesttesttesttesttesttesttesttesttest1@gmail.com",
            "a23456789012345678901234567890123456789012345678901234567890"),
            "Your email address must be less than 51 characters.");

            // Too long password
            Assert.AreEqual(userService.Validate("12345678901234567890",
            "testtesttesttesttesttesttesttesttesttest@gmail.com",
            "Aa23456789012345678901234567890123456789012345678901234567890"),
            "Your password must contain between 8 and 60 characters.");

            // Practical input
            Assert.AreEqual(userService.Validate("Mike", "mike.hello123@yahoo.co.jp",
            "mike-hello-Goodbye!123"), null);

            // Including a space
            Assert.AreEqual(userService.Validate("Mike Zaizen",
                "mike.hello123@yahoo.co.jp",
                "mike-hello Goodbye!123"), null);
        }

        [TestMethod]
        public void GetMinimumXpForTheLevel_testLv1()
        {
            Assert.AreEqual(0, UserService.GetMinimumXpForTheLevel(1));
        }

        [TestMethod]
        public void GetMinimumXpForTheLevel_testLv2()
        {
            Assert.AreEqual(100, UserService.GetMinimumXpForTheLevel(2));
        }

        [TestMethod]
        public void GetMinimumXpForTheLevel_testLv3()
        {
            Assert.AreEqual(210, UserService.GetMinimumXpForTheLevel(3));
        }

        [TestMethod]
        public void GetMinimumXpForTheLevel_testLv4()
        {
            Assert.AreEqual(331, UserService.GetMinimumXpForTheLevel(4));
        }

        [TestMethod]
        public void GetMinimumXpForTheLevel_testLv5()
        {
            Assert.AreEqual(465, UserService.GetMinimumXpForTheLevel(5));
        }

        [TestMethod]
        public void GetMinimumXpForTheLevel_testLv30()
        {
            Assert.AreEqual(14864, UserService.GetMinimumXpForTheLevel(30));
        }

        [TestMethod]
        public void GetMinimumXpForTheLevel_testLv50()
        {
            Assert.AreEqual(105719, UserService.GetMinimumXpForTheLevel(50));
        }

        [TestMethod]
        public void GetMinimumXpForTheLevel_testLv100()
        {
            Assert.AreEqual(12526830, UserService.GetMinimumXpForTheLevel(100));
        }

        [TestMethod]
        public void GetXpProgress_0()
        {
            var service = new UserService();
            var progress = service.GetXpProgress(0);

            Assert.AreEqual(0, progress.xpProgress);
            Assert.AreEqual(100, progress.necessaryXp);
        }

        [TestMethod]
        public void GetXpProgress_45()
        {
            var service = new UserService();
            var progress = service.GetXpProgress(45);

            Assert.AreEqual(45, progress.xpProgress);
            Assert.AreEqual(100, progress.necessaryXp);
        }

        [TestMethod]
        public void GetXpProgress_100()
        {
            var service = new UserService();
            var progress = service.GetXpProgress(100);

            Assert.AreEqual(0, progress.xpProgress);
            Assert.AreEqual(110, progress.necessaryXp);
        }

        [TestMethod]
        public void GetXpProgress_209()
        {
            var service = new UserService();
            var progress = service.GetXpProgress(209);

            Assert.AreEqual(109, progress.xpProgress);
            Assert.AreEqual(110, progress.necessaryXp);
        }

        [TestMethod]
        public void GetXpProgress_12526830()
        {
            var service = new UserService();
            var progress = service.GetXpProgress(12526830);

            Assert.AreEqual(0, progress.xpProgress);
            Assert.AreEqual(1252783, progress.necessaryXp);
        }

        [TestMethod]
        public void GetXpProgress_13779612()
        {
            var service = new UserService();
            var progress = service.GetXpProgress(13779612);

            Assert.AreEqual(1252782, progress.xpProgress);
            Assert.AreEqual(1252783, progress.necessaryXp);
        }
    }
}