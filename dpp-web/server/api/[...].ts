export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = event.path.replace(/^\/api/, '')
  
  try {
    const body = event.method !== 'GET' ? await readBody(event) : undefined
    return await $fetch(`${config.public.apiBase}${path}`, {
      method: event.method,
      headers: getRequestHeaders(event),
      body,
    })
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'API request failed',
    })
  }
})
