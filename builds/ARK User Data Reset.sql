USE [ASTS]
GO

ALTER TABLE [User].[UserSecurityQuestion] DROP CONSTRAINT [FK_UserSecurityQuestion_User]
GO

ALTER TABLE [User].[UserSecurityQuestion] DROP CONSTRAINT [FK_UserSecurityQuestion_SecurityQuestion]
GO

/****** Object:  Table [User].[UserSecurityQuestion]    Script Date: 2021-07-29 3:20:00 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[User].[UserSecurityQuestion]') AND type in (N'U'))
DROP TABLE [User].[UserSecurityQuestion]
GO

/****** Object:  Table [User].[User]    Script Date: 2021-07-29 3:19:54 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[User].[User]') AND type in (N'U'))
DROP TABLE [User].[User]
GO

/****** Object:  Table [User].[User]    Script Date: 2021-07-29 3:19:54 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [User].[User](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[userName] [varchar](50) NOT NULL,
	[firstName] [varchar](50) NULL,
	[lastName] [varchar](50) NULL,
	[email] [varchar](50) NOT NULL,
	[password] [varchar](200) NOT NULL,
 CONSTRAINT [PK__Users__CBA1B257A914F13C] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [User].[UserSecurityQuestion](
	[userId] [bigint] NOT NULL,
	[securityQuestionId] [bigint] NOT NULL,
	[answer] [varchar](100) NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE [User].[UserSecurityQuestion]  WITH CHECK ADD  CONSTRAINT [FK_UserSecurityQuestion_SecurityQuestion] FOREIGN KEY([securityQuestionId])
REFERENCES [User].[SecurityQuestion] ([Id])
GO

ALTER TABLE [User].[UserSecurityQuestion] CHECK CONSTRAINT [FK_UserSecurityQuestion_SecurityQuestion]
GO

ALTER TABLE [User].[UserSecurityQuestion]  WITH CHECK ADD  CONSTRAINT [FK_UserSecurityQuestion_User] FOREIGN KEY([userId])
REFERENCES [User].[User] ([Id])
GO

ALTER TABLE [User].[UserSecurityQuestion] CHECK CONSTRAINT [FK_UserSecurityQuestion_User]
GO