// Reference
// https://github.com/AzureADQuickStarts/WebApp-OpenIDConnect-NodeJS/blob/master/app.js

// Require proper strategy - passport-azure-ad
const OIDCStrategy = require("passport-azure-ad").OIDCStrategy;
const mongoose = require("mongoose");

// CONFIG FOR SETTINGS TO COMMUNICATE TO MS AZURE
const config = require("../config/config");

// Model for talking to DB
// In this case its User for finding / creating users in DB
const User = require("../models/User");

// Expecting const passport = require('passport') to be passed into function
// Exporting function to be used in server.js - line 21

module.exports = function (passport) {
  // Credentials are grabbed
  const strategyInfo = config.creds;
  passport.use(
    new OIDCStrategy(
      // Credentials for connecting to MS Azure
      {
        identityMetadata: strategyInfo.identityMetadata,
        clientID: strategyInfo.clientID,
        responseType: strategyInfo.responseType,
        responseMode: strategyInfo.responseMode,
        redirectUrl: strategyInfo.redirectUrl,
        allowHttpForRedirectUrl: strategyInfo.allowHttpForRedirectUrl,
        clientSecret: strategyInfo.clientSecret,
        validateIssuer: strategyInfo.validateIssuer,
        isB2C: strategyInfo.isB2C,
        issuer: strategyInfo.issuer,
        passReqToCallback: strategyInfo.passReqToCallback,
        scope: strategyInfo.scope,
        loggingLevel: strategyInfo.loggingLevel,
        nonceLifetime: strategyInfo.nonceLifetime,
        nonceMaxAmount: strategyInfo.nonceMaxAmount,
        useCookieInsteadOfSession: strategyInfo.useCookieInsteadOfSession,
        cookieEncryptionKeys: strategyInfo.cookieEncryptionKeys,
        clockSkew: strategyInfo.clockSkew,
      },
      // After connected then callback function
      async (accessToken, refreshToken, profile, done) => {
        console.log("auth: ", profile);

        // Profiled given by Microsoft Azure after successful connection
        const newUser = {
          microsoftId: profile.oid,
          displayName: profile.displayName,
        };

        try {
          // Find the user with MS Profile ID
          let user = await User.findOne({ microsoftId: profile.oid });

          // If there is a user then login
          if (user) {
            done(null, user);
          } else {
            // If there isn't a user then Create with [User] Model
            // Then login
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  // To support persistent login sessions, Passport needs to be able to
  // serialize users into and deserialize users out of the session.  Typically,
  // this will be as simple as storing the user ID when serializing, and finding
  // the user by ID when deserializing.

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
