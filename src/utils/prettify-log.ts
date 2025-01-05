/**
 * 美化打印
 *
 * @author Himmeltala
 * @date 2023 年 1 月 15 日
 */

export function primary(title: string, msg: string) {
  console.log(
    `%c${title}%c${msg}`,
    "background: #409eff; color: #fff; border-radius: 3px 0 0 3px; padding: 10px",
    "margin-left: 10px;"
  );
}

export function warning(title: string, msg: string) {
  console.log(
    `%c${title}%c${msg}`,
    "background: #ea5d5e; color: #fff; border-radius: 3px 0 0 3px; padding: 10px",
    "margin-left: 10px;"
  );
}
