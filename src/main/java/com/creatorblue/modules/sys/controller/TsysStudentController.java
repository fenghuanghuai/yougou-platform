package com.creatorblue.modules.sys.controller;

import com.creatorblue.common.constants.Constant;
import com.creatorblue.common.interceptor.RepeatToken;
import com.creatorblue.common.utils.PageUtils;
import com.creatorblue.common.utils.Query;
import com.creatorblue.common.utils.R;
import com.creatorblue.common.validator.ValidatorUtils;
import com.creatorblue.config.CustomPropertiesConfig;
import com.creatorblue.core.baseclass.controller.CreatorblueController;
import com.creatorblue.modules.sys.domain.TsysRole;
import com.creatorblue.modules.sys.domain.TsysStudent;
import com.creatorblue.modules.sys.service.*;
import com.github.pagehelper.PageHelper;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Title:学生管理
 * Copyright: Copyright (c) 2017
 * Company:creatorblue.co.,ltd
 *
 * @author creatorblue.co., ltd
 * @version 1.0
 */
@RestController
@RequestMapping("/sys/student")

public class TsysStudentController extends CreatorblueController {
    @Autowired
    private TsysStudentService tsysStudentService;
    @Autowired
    private TsysRoleService tsysRoleService;

    @Autowired
    private TuserRoleService tuserRoleService;
    @Autowired
    CustomPropertiesConfig customPropertiesConfig;

    @Autowired
    private TsysUserinfoController tsysUserinfoController;

    /**
     * 学生列表
     */
    @SuppressWarnings("unchecked")
    @RequestMapping("/queryall")
    @RequiresPermissions("sys:student:list")
    /**
     　　* @description: TODO
     * @author fgh
     * @param * @param params
     * @return java.util.List<com.creatorblue.modules.sys.domain.TsysRole>
     * @throws
     * @date 2021/11/13 14:28
     */
    public List<TsysRole> queryNoPage(@RequestParam Map<String, Object> params) throws Exception {
        //如果不是超级管理员，则只查询自己创建的角色列表
        if (!getUserId().equalsIgnoreCase(Constant.SUPER_ADMIN)) {
            params.put("createUserId", getUserId());
        }

        //查询列表数据
        //Query query = new Query(params);
        //PageHelper.startPage(query.getPage(),query.getLimit());
        List<TsysRole> list = tsysStudentService.selectListByMap(params);
        //PageUtils pageUtil = new PageUtils(list,query.getPage(),query.getLimit());

        return list;
    }


    /**
     * 详细信息
     */
    @RequestMapping("/view/{id}")
    @RequiresPermissions("sys:student:info")
    public ModelAndView view(@PathVariable("id") String id) {

        TsysStudent student = tsysStudentService.selectObjectByStudentId(id);

        ModelAndView mv = new ModelAndView("modules/sys/tsysstudentform")
                .addObject("tsysStudent", student);
        return mv;
    }

    /**
     * 学生列表
     */
    @SuppressWarnings("unchecked")
    @RequestMapping("/query")
    @RequiresPermissions("sys:student:list")
    public R query(@RequestParam Map<String, Object> params) {
        //如果不是超级管理员，则只查询自己创建的角色列表
        if (!getUserId().equalsIgnoreCase(Constant.SUPER_ADMIN)) {
            params.put("createUserId", getUserId());
        }

        //查询列表数据
        Query query = new Query(params);
        PageHelper.startPage(query.getPage(), query.getLimit());
        List<TsysStudent> list = tsysStudentService.selectStudentByMap(query);
        PageUtils pageUtil = new PageUtils(list, query.getPage(), query.getLimit());
        convertOrgId(list, "orgId");
        return R.ok().put("page", pageUtil);
    }

    /**
     * 角色主页面
     */
    @RequestMapping("/list")
    @RequiresPermissions("sys:student:list")
    public ModelAndView list() {
        return new ModelAndView("modules/sys/tsysstudentlist");
    }

    /**
     * 学生新增页面
     */
    @RequestMapping("/add")
    @RequiresPermissions("sys:student:add")
    @RepeatToken(save = true)

    public ModelAndView add(HttpServletRequest request, HttpServletResponse response) {
        ModelAndView mav = new ModelAndView("modules/sys/tsysstudentform");
        mav.addObject("DATA_SCOPE", Constant.DATA_SCOPE.values());
        TsysStudent tsysStudent = new TsysStudent();

        mav.addObject("tsysStudent", tsysStudent);
        return mav;
    }

    /**
     * 分配角色
     */
    @RequestMapping("/setUser/{roleId}")
    @RequiresPermissions("sys:role:list")
    //@RepeatToken(save = true)
    public ModelAndView setUser(@PathVariable("roleId") String roleId, HttpServletRequest request, HttpServletResponse response) {
        ModelAndView mv = new ModelAndView("modules/sys/tsysroleuserform");
        //mv.addObject("repeattoken", request.getSession(true).getAttribute("repeattoken"));
        TsysRole tsysRole = (TsysRole) tsysRoleService.selectObjectById(roleId);
        tsysRole.setUserIdList(tuserRoleService.selectUserListByRoleId(roleId));
        mv.addObject("tsysRole", tsysRole);
        return mv;
    }

    /**
     * 角色列表
     */
    @RequestMapping("/select")
    @RequiresPermissions("sys:role:list")
    public R select() {
        Map<String, Object> map = new HashMap<>();

        //如果不是超级管理员，则只查询自己所拥有的角色列表
        if (!getUserId().equalsIgnoreCase(Constant.SUPER_ADMIN)) {
            map.put("createUserId", getUserId());
        }
        @SuppressWarnings("unchecked")
        List<TsysRole> list = tsysRoleService.selectListByMap(map);

        return R.ok().put("list", list);
    }

    /**
     * 進入修改頁面
     */
    @RequestMapping("/edit")
    @RequiresPermissions("sys:student:edit")
    @RepeatToken(save = true)

    public ModelAndView edit(HttpServletRequest request, HttpServletResponse response) {
        ModelAndView mv = new ModelAndView("modules/sys/tsysstudentform");
        mv.addObject("repeattoken", request.getSession(true).getAttribute("repeattoken"));
        mv.addObject("DATA_SCOPE", Constant.DATA_SCOPE.values());
        String studentId = request.getParameter("studentId");
        TsysStudent tsysStudent = (TsysStudent) tsysStudentService.selectObjectById(studentId);
        mv.addObject("tsysStudent", tsysStudent);
        return mv;
    }

    /**
     * 保存角色
     */
    /*
	@RequestMapping("/save")
	@RequiresPermissions("sys:role:save")
	@RepeatToken(remove = true)
	public R save(TsysRole role,List<String> menuIdList,List<String> orgIdList){
		ValidatorUtils.validateEntity(role);
		role.setCreateUserId(getUserId());
		role.setCreateTime(DateUtils.getNowTimeStamp());
		role.setStatus("1");
		if(!"9".equals(role.getDataScope())){
			role.setOrgIdList(null);
		}


		return R.ok();
	}*/

    /**
     * 保存
     */
    @RequestMapping("/saveorupdate")
    @RepeatToken(remove = true)
    public R saveorupdate(TsysStudent student, @RequestPart(value = "file", required = false) MultipartFile picture) {
        if (picture != null && !picture.isEmpty()) {
            String oldImgName = picture.getOriginalFilename();//原文件名

            String extension = oldImgName.substring(oldImgName.lastIndexOf("."));//扩展名

            String imgName = UUID.randomUUID() + extension;//新文件名

            String longName = customPropertiesConfig.getFileUploadPath() + imgName;//文件完整路径

            try {
                picture.transferTo(new File(longName));
            } catch (IOException e) {
                e.printStackTrace();
            }

            student.setStudentImg(imgName);
        }
        ValidatorUtils.validateEntity(student);

        if ((student.getStudentId() == null) || ("").equals(student.getStudentId())) {
            tsysStudentService.save(student);
        } else {

            tsysStudentService.update(student);
        }
        return R.ok();
    }

    /**
     * 保存角色
     */
    @RequestMapping("/saveRoleUser")
    @RequiresPermissions("sys:role:save")
    //@RepeatToken(remove = true)
    public R saveRoleUser(@RequestBody TsysRole role) {
        tuserRoleService.saveOrUpdateForRole(role.getRoleId(), role.getUserIdList());
        return R.ok();
    }

    /**
     * 删除角色
     */
    @RequestMapping("/remove")
    @RequiresPermissions("sys:student:remove")
    public R delete(@RequestBody String[] studentIds) {
        tsysStudentService.deleteBatch(studentIds);
        return R.ok();
    }
}

