function great_collection() {
    return {
        "info": {
            "_postman_id": "e77510f7-3dbf-4a68-950d-b52f02e781c5",
            "name": "great-collection",
            "description": "A collection for tests on **buildman**",
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "item": [
            {
                "name": "Users",
                "item": [
                    {
                        "name": "Get Users",
                        "event": [
                            {
                                "listen": "test",
                                "script": {
                                    "id": "3ad3fd5a-908c-4cda-b83f-b449e04f9b29",
                                    "type": "text/javascript",
                                    "exec": [
                                        "let res = JSON.parse(responseBody);",
                                        "",
                                        "pm.test(\"is a page 2\", () =>",
                                        "{",
                                        "    pm.expect(2).to.equal(res.page)",
                                        "})"
                                    ]
                                }
                            }
                        ],
                        "request": {
                            "method": "GET",
                            "header": [],
                            "body": {},
                            "url": {
                                "raw": "https://reqres.in/api/users?page=2",
                                "protocol": "https",
                                "host": [
                                    "reqres",
                                    "in"
                                ],
                                "path": [
                                    "api",
                                    "users"
                                ],
                                "query": [
                                    {
                                        "key": "page",
                                        "value": "2"
                                    }
                                ]
                            },
                            "description": "Get all users in page 2"
                        },
                        "response": []
                    },
                    {
                        "name": "Get a single user",
                        "event": [
                            {
                                "listen": "test",
                                "script": {
                                    "id": "a0aae8a7-adca-4b96-9190-79bd284442b5",
                                    "type": "text/javascript",
                                    "exec": [
                                        "let res = JSON.parse(responseBody);",
                                        "",
                                        "pm.test(\"is a user with id 2\", () =>",
                                        "{",
                                        "    pm.expect(2).to.equal(res.data.id)",
                                        "})"
                                    ]
                                }
                            }
                        ],
                        "request": {
                            "method": "GET",
                            "header": [],
                            "body": {},
                            "url": {
                                "raw": "https://reqres.in/api/users/2",
                                "protocol": "https",
                                "host": [
                                    "reqres",
                                    "in"
                                ],
                                "path": [
                                    "api",
                                    "users",
                                    "2"
                                ]
                            },
                            "description": "get a single user request"
                        },
                        "response": []
                    },
                    {
                        "name": "Create a User",
                        "event": [
                            {
                                "listen": "test",
                                "script": {
                                    "id": "f0f2e0ce-e9bb-4dea-b4e0-0b10192c762e",
                                    "type": "text/javascript",
                                    "exec": [
                                        "let res = JSON.parse(responseBody);",
                                        "",
                                        "pm.test(\"name from created user is correct\", () =>",
                                        "{",
                                        "    pm.expect(\"morpheus\").to.equal(res.name)",
                                        "})",
                                        "",
                                        "pm.test(\"job from created user is correct\", () =>",
                                        "{",
                                        "    pm.expect(\"leader\").to.equal(res.job)",
                                        "})"
                                    ]
                                }
                            }
                        ],
                        "request": {
                            "method": "POST",
                            "header": [
                                {
                                    "key": "Content-Type",
                                    "value": "application/json"
                                }
                            ],
                            "body": {
                                "mode": "raw",
                                "raw": "{\r\n    \"name\": \"morpheus\",\r\n    \"job\": \"leader\"\r\n}"
                            },
                            "url": {
                                "raw": "https://reqres.in/api/users",
                                "protocol": "https",
                                "host": [
                                    "reqres",
                                    "in"
                                ],
                                "path": [
                                    "api",
                                    "users"
                                ]
                            }
                        },
                        "response": []
                    }
                ]
            },
            {
                "name": "Login",
                "event": [
                    {
                        "listen": "test",
                        "script": {
                            "id": "43c161c0-b907-4a9d-bc90-19bfe7df3ce5",
                            "type": "text/javascript",
                            "exec": [
                                "let res = JSON.parse(responseBody);",
                                "",
                                "pm.test(\"returns a token\", () =>",
                                "{",
                                "    pm.expect(res.token).not.be.null",
                                "})"
                            ]
                        }
                    }
                ],
                "request": {
                    "method": "POST",
                    "header": [
                        {
                            "key": "Content-Type",
                            "value": "application/json"
                        }
                    ],
                    "body": {
                        "mode": "raw",
                        "raw": "{\r\n    \"email\": \"peter@klaven\",\r\n    \"password\": \"cityslicka\"\r\n}"
                    },
                    "url": {
                        "raw": "https://reqres.in/api/login",
                        "protocol": "https",
                        "host": [
                            "reqres",
                            "in"
                        ],
                        "path": [
                            "api",
                            "login"
                        ]
                    },
                    "description": "A login request"
                },
                "response": []
            }
        ],
        "event": [
            {
                "listen": "prerequest",
                "script": {
                    "id": "12501068-aaee-4abd-9729-3e2baa6cec51",
                    "type": "text/javascript",
                    "exec": [
                        "console.log(\"this is a prerequest script\");"
                    ]
                }
            },
            {
                "listen": "test",
                "script": {
                    "id": "be4031d3-4452-41c6-a647-23f263fd8f6b",
                    "type": "text/javascript",
                    "exec": [
                        "console.log(\"this is a test script\");"
                    ]
                }
            }
        ]
    }
}

module.exports.great_collection = great_collection;