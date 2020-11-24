export const ACCESS_TOKEN_KEY = "access_token";

export const BASE_API_URL = "http://127.0.0.1:8000/api";
export const POST_LIST_URL = `${BASE_API_URL}/posts/`;
export const BASE_POST_DETAIL_URL = POST_LIST_URL;
export const BASE_COMMENT_LIST_URL = POST_LIST_URL;
export const BASE_COMMENT_CREATE_URL = BASE_POST_DETAIL_URL;
export const BASE_COMMENT_TOGGLE_LIKE_URL = `${BASE_API_URL}/comments`;

// AUTH
export const LOGIN_URL = `${BASE_API_URL}/dj-rest-auth/login/`;
export const CURRENT_USER_URL = `${BASE_API_URL}/current-user/`;
export const LOGOUT_URL = `${BASE_API_URL}/dj-rest-auth/logout/`;
