USE [master]
GO

/****** Object:  Login [arkapi]    Script Date: 2021-08-12 4:59:30 PM ******/
DROP LOGIN [arkapi]
GO

/* For security reasons the login is created disabled and with a random password. */
/****** Object:  Login [arkapi]    Script Date: 2021-08-12 4:59:30 PM ******/
CREATE LOGIN [arkapi] WITH PASSWORD=N'V01oRK2xTgGyK3+g2tSu/hPDOoSIfQjc90AJPCZj/JQ=', DEFAULT_DATABASE=[master], DEFAULT_LANGUAGE=[us_english], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
GO

ALTER LOGIN [arkapi] DISABLE
GO

ALTER SERVER ROLE [sysadmin] ADD MEMBER [arkapi]
GO


