const USER_ID_STORAGE_KEY = 'escal-user-id'

export const getUserId = (): string => {
  const storedId = localStorage.getItem(USER_ID_STORAGE_KEY)
  if (storedId) return storedId

  const userId = crypto.randomUUID()
  localStorage.setItem(USER_ID_STORAGE_KEY, userId)
  return userId
}
