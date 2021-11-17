package com.creatorblue.common.annotation;

import java.lang.annotation.*;

/**
 * @author fgh
 * @title: studentOrg
 * @projectName yougou-platform
 * @description: 过滤学生部门注解
 * @date 2021/11/15 14:03
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface studentOrg {
    String value() default "";

}
