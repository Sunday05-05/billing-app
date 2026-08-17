-- 只对当前现有数据库执行一次。执行前请先备份数据库。
-- 已确认 users.email 现在已经有唯一索引，不需要重复添加。
-- 已确认现有 2 条历史账单都属于用户 ID 1。

-- 第一步：先允许 NULL，给旧账单补上所属用户。
ALTER TABLE bills
  ADD COLUMN user_id BIGINT UNSIGNED NULL AFTER id;

-- 第二步：给已确认归属于原测试账户的历史账单补上用户 ID。
UPDATE bills SET user_id = 1 WHERE user_id IS NULL;

-- 第三步：确认没有遗漏；查询结果必须为 0 才能继续下一步。
SELECT COUNT(*) AS bills_without_owner
FROM bills
WHERE user_id IS NULL;

-- 第四步：禁止账单没有所属用户，并建立索引和外键。
-- TiDB 不支持在同一条 ALTER TABLE 中修改 user_id 并基于它添加索引，
-- 因此必须拆成三条语句执行。
ALTER TABLE bills
  MODIFY user_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE bills
  ADD KEY bills_user_id_id_index (user_id, id);

ALTER TABLE bills
  ADD CONSTRAINT bills_user_id_foreign
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON DELETE CASCADE;
