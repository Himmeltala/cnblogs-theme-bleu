export async function useLoading(loading?: Function) {
  Broswer.startLoading();

  loading && (await loading());

  Broswer.endLoading();
}
