using Microsoft.AspNetCore.Mvc;
using Z_Apps.Models;
using static Z_Apps.Models.UserService;

namespace Z_Apps.Controllers
{
    [Route("api/[controller]")]
    public class UserController : _LNBaseController
    {
        public UserController()
        {
            userService = new UserService();
        }

        [HttpGet("[action]/")]
        public XpProgress GetXpProgress()
        {
            var xp = GetUserFromCookies().Xp;
            return userService.GetXpProgress(xp);
        }
    }
}