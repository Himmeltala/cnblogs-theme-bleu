export async function useLoading(loading?: Function) {
  EcyUtils.startLoading();

  loading && (await loading());

  EcyUtils.endLoading();
}
