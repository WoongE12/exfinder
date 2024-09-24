<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="logout-status" content="${sessionScope.userId == null ? 'logged-out' : 'logged-in'}">
<title>ExFinder</title>

<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/reset.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/header.css">
<script src="${pageContext.request.contextPath}/resources/js/header.js"></script>

</head>
<body>
<c:set value="${sessionScope.dto }" var="dto"/>
	<header class="header">
		<div class="header_wrapper">
			<div class="header_start">
				<ul>
					<li onclick="location.href='/ex/'">홈</li>
					<li onclick="location.href='/ex/user/notification'">알림</li>
					<li onclick="location.href='/ex/board/listAll'">게시판</li>
				</ul>
			</div>
			<div class="header_center">
				<!-- 로고 -->
				<img src="${pageContext.request.contextPath}/resources/img/newLogo.png"
					onclick="location.href='/ex/'">
			</div>
			<c:choose>
				<c:when test="${empty dto }">
					<div class="header_end">
						<!-- 로그인, 마이페이지 등등.. -->
						<p>
							<a href="/ex/user/login">로그인</a>
						</p>
						<p>
							<a href="/ex/user/join">회원가입</a>
						</p>
					</div>
				</c:when>
				<c:otherwise>
					<div class="header_end_myPage">
						<!-- 로그인, 마이페이지 등등.. -->
						<c:choose>
    						<c:when test="${not empty dto.u_profile_img}">
        						<img src="${pageContext.request.contextPath}/resources/profile_img/${dto.u_profile_img}" onclick="location.href='/ex/user/myPage'">
    						</c:when>
    						<c:otherwise>
        						<img src="${pageContext.request.contextPath}/resources/img/Wuser.png" onclick="location.href='/ex/user/myPage'">
    						</c:otherwise>
						</c:choose>
						
						<p><a href="/ex/user/myPage"><c:out value="${dto.u_nickname }"/>님</a></p>
						<button type="button" id="toggleButton" onclick="toggleMiniMyPage()">
							
						</button>
					</div>
				</c:otherwise>
			</c:choose>
		</div>
	</header>
	<div class="header_mini_myPage" id="miniMyPage">
		<div class="header_mini_myPage_top">
			<c:choose>
    			<c:when test="${not empty dto.u_profile_img}">
        			<img src="${pageContext.request.contextPath}/resources/profile_img/${dto.u_profile_img}" onclick="location.href='/ex/user/myPage'">
    			</c:when>
    			<c:otherwise>
					<img src="${pageContext.request.contextPath}/resources/img/user.png" onclick="location.href='/ex/user/myPage'">       						
    				</c:otherwise>
			</c:choose>
			<div>
				<p class="user-info"><a href="/ex/user/myPage"><c:out value="${dto.u_nickname }"/>님</a></p>
				<p class="email-info"><c:out value="${dto.u_email }"/></p>
			</div>
			<form action="${pageContext.request.contextPath}/user/logout" method="POST">
    			<input type="submit" class="mini_myPage_button" value="로그아웃" />
			</form>
		</div>
		<div class="header_mini_myPage_bottom">
			<ul>
				<li><a href="/ex/user/myBoard">나의 게시판</a></li>
				<li><a href="/ex/user/notification">알림</a></li>
				<li><a href="/ex/user/bookMark">즐겨찾기</a></li>
			</ul>
			<button type="button" class="mini_myPage_button" onclick="location.href='/ex/user/myInfo'" >
				설정<img src="${pageContext.request.contextPath}/resources/img/Nsetup1.png">
			</button>
		</div>
	</div>
</body>
</html>