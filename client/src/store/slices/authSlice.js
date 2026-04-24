import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    message: null,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.message = action.payload?.message || "Success";
      state.error = null;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    otpVerificationRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    otpVerificationSuccess(state, action) {
      state.loading = false;
      state.message = action.payload?.message || "Verified";
      state.isAuthenticated = true;
      state.user = action.payload?.user;
    },
    otpVerificationFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    loginRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.message = action.payload?.message || "Logged in";
      state.isAuthenticated = true;
      state.user = action.payload?.user;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    logoutRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.error = null;
      state.message = "Logged out";
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    getUserRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload?.user || null;
      state.isAuthenticated = !!action.payload?.user;
    },

    getUserFailed(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },

    forgotPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    forgotPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    resetPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload?.message || "Success";
      state.user = action.payload?.user;
      state.isAuthenticated = true;
    },
    resetPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    updatePasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    /* =========================
       🔥 FIX ADDED (IMPORTANT)
    ========================= */
    resetAuth(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.user = null;
      state.isAuthenticated = false;
    },

    resetAuthSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const { resetAuthSlice, resetAuth } = authSlice.actions;

/* ===================== REGISTER ===================== */
export const register = (data, navigate, email) => async (dispatch) => {
  dispatch(authSlice.actions.registerRequest());

  try {
    const res = await api.post("/auth/register", data);

    dispatch(authSlice.actions.registerSuccess(res.data));

    if (res.data?.success) {
      navigate(`/otp-verification/${email}`);
    }

  } catch (error) {
    dispatch(
      authSlice.actions.registerFailed(
        error.response?.data?.message || "Error"
      )
    );
  }
};

/* ===================== OTP VERIFY ===================== */
export const otpVerification = (email, otp) => async (dispatch) => {
  dispatch(authSlice.actions.otpVerificationRequest());

  try {
    const res = await api.post("/auth/verify-otp", { email, otp });

    dispatch(authSlice.actions.otpVerificationSuccess(res.data));
  } catch (error) {
    dispatch(
      authSlice.actions.otpVerificationFailed(
        error.response?.data?.message || "Error"
      )
    );
  }
};

/* ===================== LOGIN ===================== */
export const login = (data) => async (dispatch) => {
  dispatch(authSlice.actions.loginRequest());

  try {
    const res = await api.post("/auth/login", data, {
      withCredentials: true,
    });

    dispatch(authSlice.actions.loginSuccess(res.data));

  } catch (error) {
    dispatch(
      authSlice.actions.loginFailed(
        error.response?.data?.message || "Error"
      )
    );
  }
};

/* ===================== LOGOUT ===================== */
export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());

  try {
    await api.get("/auth/logout", {
      withCredentials: true,
    });
  } catch (error) {}

  dispatch(authSlice.actions.logoutSuccess());
};

/* ===================== GET USER ===================== */
export const getUser = () => async (dispatch) => {
  dispatch(authSlice.actions.getUserRequest());

  try {
    const res = await api.get("/auth/me", {
      withCredentials: true,
    });

    dispatch(authSlice.actions.getUserSuccess(res.data));

  } catch (error) {
    dispatch(authSlice.actions.getUserFailed());
  }
};

/* ===================== FORGOT PASSWORD ===================== */
export const forgotPassword = (email) => async (dispatch) => {
  dispatch(authSlice.actions.forgotPasswordRequest());

  try {
    const res = await api.post("/auth/password/forgot", { email });

    dispatch(authSlice.actions.forgotPasswordSuccess(res.data.message));
  } catch (error) {
    dispatch(
      authSlice.actions.forgotPasswordFailed(
        error.response?.data?.message || "Error"
      )
    );
  }
};

/* ===================== RESET PASSWORD ===================== */
export const resetPassword = (data, token) => async (dispatch) => {
  dispatch(authSlice.actions.resetPasswordRequest());

  try {
    const res = await api.put(`/auth/password/reset/${token}`, data);

    dispatch(authSlice.actions.resetPasswordSuccess(res.data));
  } catch (error) {
    dispatch(
      authSlice.actions.resetPasswordFailed(
        error.response?.data?.message || "Error"
      )
    );
  }
};

/* ===================== UPDATE PASSWORD ===================== */
export const updatePassword =
  ({ currentPassword, newPassword, confirmNewPassword }) =>
  async (dispatch) => {
    dispatch(authSlice.actions.updatePasswordRequest());

    try {
      const res = await api.put("/auth/password/update", {
        currentPassword,
        newPassword,
        confirmPassword: confirmNewPassword,
      });

      dispatch(authSlice.actions.updatePasswordSuccess(res.data.message));
    } catch (error) {
      dispatch(
        authSlice.actions.updatePasswordFailed(
          error.response?.data?.message || "Error"
        )
      );
    }
  };

/* ===================== UPDATE PROFILE ===================== */
export const updateProfile = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updatePasswordRequest());

  try {
    const res = await api.put("/auth/profile/update", data, {
      withCredentials: true,
    });

    dispatch(authSlice.actions.getUserSuccess(res.data));

  } catch (error) {
    dispatch(
      authSlice.actions.updatePasswordFailed(
        error.response?.data?.message || "Error"
      )
    );
  }
};

export default authSlice.reducer;