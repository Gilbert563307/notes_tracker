export type ApiErrorResponse = {
  statusCode: number;
  message: string;
};


export type DownloadTaskOption = "Markdown" | "Microsoft Word" | "PDF"