using System.Linq;
using System;
using System.Text.Json.Serialization;

namespace Z_Apps.Models
{
    public class User
    {
        public int UserId
        {
            get; set;
        }
        public string Name
        {
            get; set;
        }
        public string Email
        {
            get; set;
        }
        [JsonIgnore]
        public string Password
        {
            get; set;
        }
        public string Progress
        {
            get; set;
        }
        public long Exp
        {
            get; set;
        }
        public int Level
        {
            get
            {
                /**
                *------------------
                * Exp    |   Level
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

                var _exp = Exp > 0 ? Exp : 0;

                int i = 1;
                while (true)
                {
                    if (UserService.GetMinimumExpForTheLevel(i + 1) > _exp)
                    {
                        return i;
                    }
                    i++;
                }
            }
        }
    }
}