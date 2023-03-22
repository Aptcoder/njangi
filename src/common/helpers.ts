export default class Helper {
  public static formatResponse(message: string, data = {}) {
    return {
      status: true,
      message,
      data,
    };
  }
}
