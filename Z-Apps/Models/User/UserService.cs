using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using static Z_Apps.Models.DBCon;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Z_Apps.Models.SystemBase;
using Z_Apps.Util;

namespace Z_Apps.Models
{
    public class UserService
    {
        private DBCon con;
        private StorageService storageService;
        public UserService(StorageService storageService)
        {
            con = new DBCon(DBType.wiki_db);
            this.storageService = storageService;
        }


        public bool RegisterUser(string Name, string Email, string Password, int InitialXp)
        {
            string sql = @"
INSERT INTO ZAppsUser (UserId, Name, Email, Password, Xp) VALUES
    (
        (select IsNULL(max(UserId),0)+1 from ZAppsUser),
        @Name,
        @Email,
        @Password,
        @Xp
    );
";
            return con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                { "@Name", new object[2] { SqlDbType.NVarChar, Name } },
                { "@Email", new object[2] { SqlDbType.NVarChar, Email } },
                { "@Password", new object[2] { SqlDbType.NVarChar, Password } },
                { "@Xp", new object[2] { SqlDbType.BigInt, InitialXp } },
            });
        }

        public User GetUserByEmail(string Email)
        {
            string sql = @"
SELECT UserId, Name, Email, Password, Progress, Xp, AvatarExtension, Bio
FROM ZAppsUser
WHERE Email = @Email;
";
            var result = con.ExecuteSelect(sql, new Dictionary<string, object[]> {
                { "@Email", new object[2] { SqlDbType.NVarChar, Email } },
            }).FirstOrDefault();

            if (result == null)
            {
                return null;
            }

            return new User()
            {
                UserId = (int)result["UserId"],
                Name = (string)result["Name"],
                Email = (string)result["Email"],
                Password = (string)result["Password"],
                Progress = (string)result["Progress"],
                Xp = (long)result["Xp"],
                AvatarExtension = (string)result["AvatarExtension"],
                Bio = (string)result["Bio"],
            };
        }

        public User GetUserById(int UserId)
        {
            string sql = @"
SELECT UserId, Name, Email, Password, Progress, Xp, AvatarExtension, Bio
FROM ZAppsUser
WHERE UserId = @UserId;
";
            var result = con.ExecuteSelect(sql, new Dictionary<string, object[]> {
                { "@UserId", new object[2] { SqlDbType.Int, UserId } },
            }).FirstOrDefault();

            if (result == null)
            {
                return null;
            }

            return new User()
            {
                UserId = (int)result["UserId"],
                Name = (string)result["Name"],
                Email = (string)result["Email"],
                Password = (string)result["Password"],
                Progress = (string)result["Progress"],
                Xp = (long)result["Xp"],
                AvatarExtension = (string)result["AvatarExtension"],
                Bio = (string)result["Bio"],
            };
        }

        public bool UpdateProgress(int UserId, string Progress)
        {
            string sql = @"
UPDATE ZAppsUser
SET Progress = @Progress
WHERE UserId = @UserId;
";
            return con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                { "@UserId", new object[2] { SqlDbType.Int, UserId } },
                { "@Progress", new object[2] { SqlDbType.NVarChar, Progress } },
            });
        }

        public string Validate(string name, string email, string password)
        {
            // Nickname
            if (name.Length < 1 || name.Length > 20)
            {
                return "Your username must contain between 1 and 20 characters.";
            }

            // Email
            if (email.Length < 1 || !Regex.IsMatch(email, @"^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$"))
            {
                return "Please enter a valid email address.";
            }
            if (email.Length > 50)
            {
                return "Your email address must be less than 51 characters.";
            }

            // Password
            if (password.Length < 8 || password.Length > 60)
            {
                return "Your password must contain between 8 and 60 characters.";
            }
            if (!Regex.IsMatch(password, @"([a-zA-Z])") || !Regex.IsMatch(password, @"([0-9])"))
            {
                // If the password includes one upper case and one lower case, it's ok
                if (!Regex.IsMatch(password, @"([a-z].*[A-Z])|([A-Z].*[a-z])"))
                {
                    return "Your password must contain at least one number and one letter.";
                }
            }

            return null;
        }

        public static long GetMinimumXpForTheLevel(int level)
        {
            return (long)Math.Ceiling(
                Enumerable
                    .Range(1, level - 1)
                    .Select(l => 100 * Math.Pow(1.1, (l - 1)))
                    .Sum()
            );
        }

        public static int GetLevelFromXp(long xp)
        {
            /**
            *------------------
            * XP    |   Level
            *------------------
            * 0      ->  1
            * 100    ->  2
            * 210    ->  3
            * 331    ->  4
            * 465    ->  5
            * ...
            * 14864  ->  30
            * 105719 ->  50
            * 116391 ->  51
            * 12526830 -> 100
            * 13779613 -> 101
            **/

            var _xp = xp > 0 ? xp : 0;

            int i = 1;
            while (true)
            {
                if (UserService.GetMinimumXpForTheLevel(i + 1) > _xp)
                {
                    return i;
                }
                i++;
            }
        }

        public XpProgress GetXpProgress(long Xp)
        {
            var currentLevel = GetLevelFromXp(Xp);
            var nextLevel = currentLevel + 1;
            var minimumXpForCurrentLevel = GetMinimumXpForTheLevel(currentLevel);
            var xpForNextLevel = GetMinimumXpForTheLevel(nextLevel);

            return new XpProgress()
            {
                xpProgress = Xp - minimumXpForCurrentLevel,
                necessaryXp = xpForNextLevel - minimumXpForCurrentLevel
            };
        }
        public class XpProgress
        {
            public long xpProgress { get; set; }
            public long necessaryXp { get; set; }
        }

        public bool AddXp(long XpToAdd, int UserId)
        {
            var sql = @"
update ZAppsUser
set Xp = Xp + @XpToAdd
where UserId = @UserId;
";
            return con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                { "@XpToAdd", new object[2] { SqlDbType.BigInt, XpToAdd } },
                { "@UserId", new object[2] { SqlDbType.Int, UserId } },
            });
        }

        public bool UpdateBio(int UserId, string Bio)
        {
            if (Bio?.Length > 999)
            {
                return false;
            }

            string sql = @"
UPDATE ZAppsUser
SET Bio = @Bio
WHERE UserId = @UserId;
";
            return con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                { "@UserId", new object[2] { SqlDbType.Int, UserId } },
                { "@Bio", new object[2] { SqlDbType.NVarChar, Bio ?? "" } },
            });
        }

        public bool UpdateName(int UserId, string Name)
        {
            if (Name.Length > 20 || string.IsNullOrEmpty(Name))
            {
                return false;
            }

            string sql = @"
UPDATE ZAppsUser
SET Name = @Name
WHERE UserId = @UserId;
";
            return con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                { "@UserId", new object[2] { SqlDbType.Int, UserId } },
                { "@Name", new object[2] { SqlDbType.NVarChar, Name } },
            });
        }

        public async Task<bool> UpdateAvatar(int userId, IFormFile file)
        {
            var allowedFileTypes = new string[] {
                "image/jpeg",
                "image/png",
                "image/gif"
            };

            if (file == null ||
                !allowedFileTypes.Contains(file.ContentType) ||
                file.Length <= 0 ||
                file.Length > 10000000
            )
            {
                return false;
            }

            var extension = "." + file.ContentType.Replace("image/", "");

            var smallTask = storageService
                            .ResizeAndUploadImage(
                                file,
                                150,
                                150,
                                $"user/{userId}/avatarImage/150_150{extension}"
                            );

            var width300Task = storageService
                                .ResizeAndUploadImage(
                                    file,
                                    300,
                                    1500,
                                    $"user/{userId}/avatarImage/width300{extension}"
                                );

            var width600Task = storageService
                                .ResizeAndUploadImage(
                                    file,
                                    600,
                                    3000,
                                    $"user/{userId}/avatarImage/width600{extension}"
                                );

            var results = await Task.WhenAll(smallTask, width300Task, width600Task);

            if (results.Contains(false))
            {
                return false;
            }

            string sql = @"
UPDATE ZAppsUser
SET AvatarExtension = @AvatarExtension
WHERE UserId = @UserId;
";
            return con.ExecuteUpdate(sql, new Dictionary<string, object[]> {
                { "@UserId", new object[2] { SqlDbType.Int, userId } },
                { "@AvatarExtension", new object[2] { SqlDbType.NVarChar, extension } },
            });
        }

        public IEnumerable<User> GetUsersForRanking()
        {
            string sql = @"
select top(99)
UserId, Name, Xp, AvatarExtension
from ZAppsUser with(index(IX_ZAppsUser_Xp_Ranking_Index))
order by Xp desc;
";
            return con
                    .ExecuteSelect(sql)
                    .Select(result => new User()
                    {
                        UserId = (int)result["UserId"],
                        Name = (string)result["Name"],
                        Xp = (long)result["Xp"],
                        AvatarExtension = (string)result["AvatarExtension"],
                    });
        }
    }
}