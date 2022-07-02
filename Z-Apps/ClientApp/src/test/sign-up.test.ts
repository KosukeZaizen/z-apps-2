import "jest";
import {
    realTimeValidate,
    submissionValidate,
} from "../components/zApps/Layout/Login/SignUp/validation";

describe("Sign up", () => {
    /**
     * real-time validation
     */
    describe("real-time validation", () => {
        const validate = realTimeValidate;

        test("empty input", () => {
            const result = validate("", "", "");
            expect(result).toBeNull();
        });

        test("empty password", () => {
            const result = validate("", "test@gmail.com", "");
            expect(result).toBeNull();
        });

        test("shortest input", () => {
            const result = validate("a", "a@aa.aa", "Aaaaaaaa");
            expect(result).toBeNull();
        });

        test("longest input", () => {
            const result = validate(
                "12345678901234567890",
                "testtesttesttesttesttesttesttesttesttest@gmail.com",
                "a23456789012345678901234567890123456789012345678901234567890"
            );
            expect(result).toBeNull();
        });

        test("no name field", () => {
            const result = validate(
                "",
                "testtesttesttesttesttesttesttesttesttest@gmail.com",
                "a23456789012345678901234567890123456789012345678901234567890"
            );
            expect(result).toBeNull();
        });

        test("too short email", () => {
            const result = validate("a", "a@aa.a", "Aaaaaaaa");
            expect(result).toBe("Please enter a valid email address.");
        });

        test("too short password", () => {
            const result = validate("a", "a@aa.aa", "Aaaaaaa");
            expect(result).toBe(
                "Your password must contain between 8 and 60 characters."
            );
        });

        test("too long name", () => {
            const result = validate(
                "12345678901234567890a",
                "testtesttesttesttesttesttesttesttesttest@gmail.com",
                "a23456789012345678901234567890123456789012345678901234567890"
            );
            expect(result).toBe(
                "Your username must contain between 1 and 20 characters."
            );
        });

        test("too long email", () => {
            const result = validate(
                "12345678901234567890",
                "testtesttesttesttesttesttesttesttesttest1@gmail.com",
                "a23456789012345678901234567890123456789012345678901234567890"
            );
            expect(result).toBe(
                "Your email address must be less than 51 characters."
            );
        });

        test("too long password", () => {
            const result = validate(
                "12345678901234567890",
                "testtesttesttesttesttesttesttesttesttest@gmail.com",
                "Aa23456789012345678901234567890123456789012345678901234567890"
            );
            expect(result).toBe(
                "Your password must contain between 8 and 60 characters."
            );
        });

        test("practical input", () => {
            const result = validate(
                "Mike",
                "mike.hello123@yahoo.co.jp",
                "mike-hello-Goodbye!123"
            );
            expect(result).toBeNull();
        });

        test("including space", () => {
            const result = validate(
                "Mike Zaizen",
                "mike.hello123@yahoo.co.jp",
                "mike-hello Goodbye!123"
            );
            expect(result).toBeNull();
        });
    });

    /**
     * submission validation
     */
    describe("submission validation", () => {
        const validate = submissionValidate;

        test("empty input", () => {
            const result = validate("", "", "");
            expect(result).toBe("Please enter a valid email address.");
        });

        test("empty password", () => {
            const result = validate("", "test@gmail.com", "");
            expect(result).toBe(
                "Your password must contain between 8 and 60 characters."
            );
        });

        test("shortest input", () => {
            const result = validate("a", "a@aa.aa", "Aaaaaaaa");
            expect(result).toBeNull();
        });

        test("longest input", () => {
            const result = validate(
                "12345678901234567890",
                "testtesttesttesttesttesttesttesttesttest@gmail.com",
                "a23456789012345678901234567890123456789012345678901234567890"
            );
            expect(result).toBeNull();
        });

        test("no name field", () => {
            const result = validate(
                "",
                "testtesttesttesttesttesttesttesttesttest@gmail.com",
                "a23456789012345678901234567890123456789012345678901234567890"
            );
            expect(result).toBeNull();
        });

        test("too short email", () => {
            const result = validate("a", "a@aa.a", "Aaaaaaaa");
            expect(result).toBe("Please enter a valid email address.");
        });

        test("too short password", () => {
            const result = validate("a", "a@aa.aa", "Aaaaaaa");
            expect(result).toBe(
                "Your password must contain between 8 and 60 characters."
            );
        });

        test("too long name", () => {
            const result = validate(
                "12345678901234567890a",
                "testtesttesttesttesttesttesttesttesttest@gmail.com",
                "a23456789012345678901234567890123456789012345678901234567890"
            );
            expect(result).toBe(
                "Your username must contain between 1 and 20 characters."
            );
        });

        test("too long email", () => {
            const result = validate(
                "12345678901234567890",
                "testtesttesttesttesttesttesttesttesttest1@gmail.com",
                "a23456789012345678901234567890123456789012345678901234567890"
            );
            expect(result).toBe(
                "Your email address must be less than 51 characters."
            );
        });

        test("too long password", () => {
            const result = validate(
                "12345678901234567890",
                "testtesttesttesttesttesttesttesttesttest@gmail.com",
                "Aa23456789012345678901234567890123456789012345678901234567890"
            );
            expect(result).toBe(
                "Your password must contain between 8 and 60 characters."
            );
        });

        test("practical input", () => {
            const result = validate(
                "Mike",
                "mike.hello123@yahoo.co.jp",
                "mike-hello-Goodbye!123"
            );
            expect(result).toBeNull();
        });

        test("including space", () => {
            const result = validate(
                "Mike Zaizen",
                "mike.hello123@yahoo.co.jp",
                "mike-hello Goodbye!123"
            );
            expect(result).toBeNull();
        });
    });
});
