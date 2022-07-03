using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Z_Apps.Models;

namespace Z_Apps.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : _LNBaseController
    {
        [HttpPost("[action]/")]
        public IActionResult Register([FromBody] RegisterParam param)
        {
            var validationResult = userService.Validate(param.Name, param.Email, param.Password);
            if (validationResult != null)
            {
                return BadRequest(new
                {
                    error = validationResult
                });
            }

            var duplicatedUser = userService.GetUserByEmail(param.Email);
            if (duplicatedUser != null)
            {
                return BadRequest(new
                {
                    error = "duplication"
                });
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(param.Password);

            bool result = userService.RegisterUser(
                param.Name,
                param.Email,
                hashedPassword
            );

            if (result)
            {
                var user = userService.GetUserByEmail(param.Email);
                var jwt = jwtService.Generate(user.UserId);
                Response.Cookies.Append("jwt", jwt, new CookieOptions
                {
                    HttpOnly = true, // For security
                    SameSite = SameSiteMode.Strict, // For security
                    Secure = true, // For security
                    MaxAge = TimeSpan.MaxValue,
                });

                Task.Run(async () =>
                {
                    await Task.Delay(2000);
                    EmailService.SendToAdmin(
                        "New LN Account!",
                        "<h1>New user signed up!</h1><br/>" + param.Name
                    );
                });

                return Ok(user);
            }

            return BadRequest(new
            {
                error = "Failed to register"
            });
        }
        public class RegisterParam
        {
            public string Name
            {
                get; set;
            }
            public string Email
            {
                get; set;
            }
            public string Password
            {
                get; set;
            }
            public long InitialXp
            {
                get; set;
            }
        }

        [HttpPost("[action]/")]
        public IActionResult Login([FromBody] LoginParam param)
        {
            var user = userService.GetUserByEmail(param.Email);
            if (user == null)
            {
                return BadRequest(new
                {
                    error = "emailNoMatch",
                });
            }

            if (!BCrypt.Net.BCrypt.Verify(param.Password, user.Password))
            {
                return BadRequest(new
                {
                    error = "passwordNoMatch",
                });
            }

            var jwt = jwtService.Generate(user.UserId);

            Response.Cookies.Append("jwt", jwt, new CookieOptions
            {
                HttpOnly = true, // For security
                SameSite = SameSiteMode.Strict, // For security
                Secure = true, // For security
                MaxAge = param.RememberMe
                            ? TimeSpan.MaxValue
                            : (TimeSpan?)null,
            });

            return Ok(user);
        }
        public class LoginParam
        {
            public string Email
            {
                get; set;
            }
            public string Password
            {
                get; set;
            }
            public bool RememberMe
            {
                get; set;
            }
        }

        [HttpGet("[action]/")]
        public IActionResult GetUser()
        {
            try
            {
                return Ok(GetUserFromCookies());
            }
            catch
            {
                return Ok(new
                {
                    error = "unauthorized",
                });
            }
        }

        [HttpGet("[action]/")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");

            return Ok(new
            {
                message = "success",
            });
        }

        [HttpPost("[action]/")]
        public IActionResult SaveProgress([FromBody] SaveProgressParam param)
        {
            try
            {
                var progress = param.Progress;

                if (progress == null || progress == "null" || progress == "undefined")
                {
                    return Ok(new
                    {
                        message = "no data to save",
                    });
                }
                int userId = GetUserIdFromCookies();

                var result = userService.UpdateProgress(userId, progress);
                if (!result)
                {
                    return BadRequest(new
                    {
                        error = "failed to save progress",
                    });
                }
                return Ok(new
                {
                    message = "success",
                });
            }
            catch
            {
                return Unauthorized();
            }
        }
        public class SaveProgressParam
        {
            public string Progress
            {
                get; set;
            }
        }
    }
}