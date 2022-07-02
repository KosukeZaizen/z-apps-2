using System;
using System.Collections.Generic;
using Z_Apps.Util;

namespace Z_Apps.Models
{
    public class EmailService
    {
        public static bool SendToAdmin(string subject, string html)
        {
            try
            {
                var jsonString = Fetch.Post(
                    $"{Consts.ARTICLES_URL}/api/email/sendEmail",
                    new Dictionary<string, string>() {
                    {"token", PrivateConsts.EMAIL_TOKEN},
                    {"to", PrivateConsts.ADMIN_EMAIL_ADDRESS},
                    {"from", "Lingual Ninja <lingual.ninja.email@gmail.com>"},
                    {"subject", subject},
                    {"html", html},
                    }
                );

                if (!jsonString.Contains("\"responseType\":\"success\"")
                    || !jsonString.Contains("\"emailResult\":\"sent\""))
                {
                    ErrorLog.InsertErrorLog(jsonString);
                    return false;
                }
                return true; // success
            }
            catch (Exception ex)
            {
                ErrorLog.InsertErrorLog(ex.ToString());
                return false;
            }
        }
    }
}