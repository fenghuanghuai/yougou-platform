package com.creatorblue.modules.sys.service;

import com.creatorblue.common.annotation.SysLog;
import com.creatorblue.common.annotation.studentOrg;
import com.creatorblue.common.utils.Identities;
import com.creatorblue.common.utils.Query;
import com.creatorblue.core.baseclass.service.BaseService;
import com.creatorblue.modules.sys.domain.TsysStudent;
import com.creatorblue.modules.sys.persistence.TsysStudentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 学生管理业务层
 */
@Service("tsysStudentService")
public class TsysStudentService extends BaseService {
    @Autowired
    private TsysStudentMapper mapper;
    public TsysStudentMapper getMapper(){return mapper;}

    @studentOrg("过滤其他机构的数据")
    public List<TsysStudent> selectStudentByMap(Query queue){
        List<TsysStudent> list =   getMapper().selectStudentByMap(queue);
        return list ;
    }
    public TsysStudent selectObjectByStudentId(String studentId) {
        return getMapper().selectObjectById(studentId);
    }
    @Transactional
    @SysLog("新增学生信息")
    public void save(TsysStudent student) {

        student.setStudentId(Identities.uuid());

        getMapper().insert(student);

    }
    @Transactional
    @SysLog("修改角色信息")
    public void update(TsysStudent tsysStudent) {
        getMapper().update(tsysStudent);
    }

    @Transactional
    @SysLog("删除角色信息")
    public void deleteBatch(String[] studentIds) {

        getMapper().deleteBatch(studentIds);
    }

}
