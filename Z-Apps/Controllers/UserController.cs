using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Mvc;
using Z_Apps.Models;
using static Z_Apps.Models.UserService;

namespace Z_Apps.Controllers
{
    [Route("api/[controller]")]
    public class UserController : _LNBaseController
    {
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

            return Ok(new
            {
                user = user,
                levelUp = levelUp
            });
        }
    }
}