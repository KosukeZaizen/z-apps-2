using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Z_Apps.Util;

namespace Z_Apps.Models.Auth
{
    public class JwtService
    {
        /**
         * Create JWT string
         */
        public string Generate(int userId)
        {
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(PrivateConsts.JWT_KEY));
            var credentials = new SigningCredentials(
                symmetricSecurityKey,
                SecurityAlgorithms.HmacSha256Signature
            );
            var header = new JwtHeader(credentials);

            var payload = new JwtPayload(
                userId.ToString(),
                null,
                null,
                null,
                DateTime.Today.AddDays(1) // 1 day
            );

            var securityToken = new JwtSecurityToken(header, payload);

            return new JwtSecurityTokenHandler().WriteToken(securityToken);
        }

        public JwtSecurityToken Verify(string jwt)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(PrivateConsts.JWT_KEY);
            tokenHandler.ValidateToken(jwt, new TokenValidationParameters()
            {
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
            }, out SecurityToken validatedToken);

            return (JwtSecurityToken)validatedToken;
        }
    }
}
