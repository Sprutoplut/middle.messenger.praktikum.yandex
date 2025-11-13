import { MemberListProps } from '../api/type';

export default function arraysDiffer(
  arr1: MemberListProps[],
  arr2: MemberListProps[],
): boolean {
  // Если длины не совпадают — массивы точно отличаются
  if (arr1.length !== arr2.length) {
    return true;
  }

  // Сравниваем каждый элемент по порядку
  for (let i = 0; i < arr1.length; i += 1) {
    if (!isEqualMember(arr1[i], arr2[i])) {
      return true; // Найдена разница — сразу возвращаем true
    }
  }

  return false; // Все элементы совпадают
}

function isEqualMember(
  a?: MemberListProps,
  b?: MemberListProps,
): boolean {
  // Если оба undefined/null — считаем равными
  if (a == null && b == null) {
    return true;
  }
  // Если один есть, а другого нет — отличаются
  if (a == null || b == null) {
    return false;
  }

  // Сравниваем каждое поле
  return (
    a.id === b.id
    && a.MemberPhoto === b.MemberPhoto
    && a.LastMessageDate === b.LastMessageDate
    && a.LastMessageWho === b.LastMessageWho
    && a.LastMessage === b.LastMessage
    && a.CountNoReadMessage === b.CountNoReadMessage
    && a.MemberName === b.MemberName
  );
}
