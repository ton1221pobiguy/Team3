package kr.gudi.signup;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import kr.gudi.login.UserBean;

public interface SignupService {
	
	public int setUser(UserBean ub);
	
	public UserBean getUser(UserBean ub);
	
	// 이메일 중복 체크 
	public int emailcheck(UserBean ub);
	
	//회원 정보 수정 
	public int updateUser(UserBean ub);
	
	public UserBean getUserList(UserBean ub);
	
	// 회원 탈퇴 수정
	public Map<String, Object> deleteUser(UserBean ub, HttpSession session);

}
