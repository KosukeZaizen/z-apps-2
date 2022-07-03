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
            if (GetUserIdFromCookies() != userId)
            {
                return Unauthorized();
            }

            var result = userService.AddXp(xpToAdd, userId);

            if (!result)
            {
                return BadRequest(new
                {
                    error = "no data updated"
                });
            }

            return Ok(new
            {
                user = userService.GetUserById(userId)
            });
        }
    }
}