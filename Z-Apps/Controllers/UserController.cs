using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Mvc;
using Z_Apps.Models;
using static Z_Apps.Models.UserService;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using Z_Apps.Util;
using Z_Apps.Models.SystemBase;

namespace Z_Apps.Controllers
{
    [Route("api/[controller]")]
    public class UserController : _LNBaseController
    {
        public UserController(StorageService storageService) : base(storageService)
        {
        }

        [HttpGet("[action]/")]
        public XpProgress GetXpProgress(long xp)
        {
            return userService.GetXpProgress(xp);
        }

        [HttpGet("[action]/")]
        public int GetLevelFromXp(long xp)
        {
            return UserService.GetLevelFromXp(xp);
        }

        [HttpPost("[action]/")]
        public IActionResult AddXp(long xpToAdd, int userId)
        {
            var userFromCookies = GetUserFromCookies();
            if (userFromCookies.UserId != userId)
            {
                return Unauthorized();
            }

            var previousLevel = userFromCookies.Level;

            var result = userService.AddXp(xpToAdd, userId);
            if (!result)
            {
                return BadRequest(new
                {
                    error = "no data updated"
                });
            }

            var user = userService.GetUserById(userId);
            bool levelUp = previousLevel < user.Level;

            if (levelUp)
            {
                string referer = Request.Headers["Referer"].ToString();
                Task.Run(async () =>
                {
                    await Task.Delay(1000);
                    EmailService.SendToAdmin(
                        "Level up!",
                        @$"{user.Name} got {xpToAdd} XP and leveled up!<br/>
                        Level: {previousLevel} -> {user.Level}<br/>
                        UserId: {user.UserId}<br/><br/>
                        URL: {referer}"
                    );
                });
            }

            return Ok(new
            {
                user = user,
                levelUp = levelUp
            });
        }

        [HttpPost("[action]/")]
        public IActionResult UpdateBio(int userId, string bio)
        {
            var userFromCookies = GetUserFromCookies();
            if (userFromCookies.UserId != userId)
            {
                return Unauthorized();
            }

            var result = userService.UpdateBio(userId, bio);
            if (!result)
            {
                return BadRequest(new
                {
                    error = "no data updated"
                });
            }

            var user = userService.GetUserById(userId);
            string referer = Request.Headers["Referer"].ToString();
            Task.Run(async () =>
            {
                await Task.Delay(1000);
                EmailService.SendToAdmin(
                    "Bio updated!",
                    @$"{user.Name} updated bio!<br/>
                    Level: {user.Level}<br/>
                    UserId: {user.UserId}<br/>
                    URL: {referer}<br/><br/>
                    {user.Bio}"
                );
            });

            return Ok(new
            {
                user = user,
            });
        }

        [HttpPost("[action]/")]
        public IActionResult UpdateName(int userId, string name)
        {
            var userFromCookies = GetUserFromCookies();
            if (userFromCookies.UserId != userId)
            {
                return Unauthorized();
            }

            var result = userService.UpdateName(userId, name);
            if (!result)
            {
                return BadRequest(new
                {
                    error = "no data updated"
                });
            }

            var user = userService.GetUserById(userId);
            string referer = Request.Headers["Referer"].ToString();
            Task.Run(async () =>
            {
                await Task.Delay(1000);
                EmailService.SendToAdmin(
                    "Username updated!",
                    @$"{userFromCookies.Name} updated the username into {user.Name}!<br/>
                    Level: {user.Level}<br/>
                    UserId: {user.UserId}<br/><br/>
                    URL: {referer}<br/><br/>
                    Bio:<br/>{user.Bio}"
                );
            });

            return Ok(new
            {
                user = user,
            });
        }

        [HttpPost("[action]/")]
        public async Task<IActionResult> UpdateAvatar(int userId, IFormFile file)
        {
            var userFromCookies = GetUserFromCookies();
            if (userFromCookies.UserId != userId)
            {
                return Unauthorized();
            }

            var result = await userService.UpdateAvatar(userId, file);
            if (!result)
            {
                return BadRequest(new
                {
                    error = "no data updated"
                });
            }

            var user = userService.GetUserById(userId);
            string referer = Request.Headers["Referer"].ToString();
            var _t = Task.Run(async () =>
            {
                await Task.Delay(1000);
                EmailService.SendToAdmin(
                    "Avatar Image uploaded!",
                    @$"{userFromCookies.Name} uploaded avatar image!<br/>
                    Level: {user.Level}<br/>
                    UserId: {user.UserId}<br/><br/>
                    URL: {referer}<br/><br/>
                    Bio:<br/>{user.Bio}"
                );
            });

            return Ok(new
            {
                user = user,
            });
        }

        [HttpGet("[action]/")]
        public IEnumerable<User> GetUsersForRanking()
        {
            return ApiCache.UseCache(
                "p",
                () => userService.GetUsersForRanking()
            );
        }

        [HttpGet("[action]/")]
        public IEnumerable<User> GetUsersAroundMyRank(int userId)
        {
            return userService.GetUsersAroundMyRank(userId);
        }

        [HttpGet("[action]/")]
        public User GetOtherUserInfo(int userId)
        {
            return userService.GetOtherUserInfo(userId);
        }
    }
}