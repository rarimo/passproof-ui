import { JsonApiError } from '@distributedlab/jac'
import { ProviderResourceUnavailable, ProviderUserRejectedRequest } from '@distributedlab/w3p'
import log from 'loglevel'

import { BusEvents } from '@/enums/bus'

import { bus } from './event-bus'

export class ErrorHandler {
  static isError(error: unknown): error is Error {
    return error instanceof Error || (error instanceof Object && 'message' in error)
  }

  static process(error: unknown, message = ''): void {
    if (!ErrorHandler.isError(error)) return
    bus.emit(BusEvents.error, {
      message: message || this.getErrorMessage(error),
    })
    ErrorHandler.processWithoutFeedback(error)
  }

  static processWithoutFeedback(error: unknown): void {
    if (!ErrorHandler.isError(error)) return
    log.error(error)
  }

  private static getErrorMessage(error: Error): string {
    if (error instanceof JsonApiError && error.httpStatus) {
      const statusToMessage: Record<number, string> = {
        400: 'The request does not pass our server validation, please check your input',
        401: 'Seems like you are not authorized to perform this action',
        403: 'Seems like you are not allowed to do this',
        404: 'Our service cannot find the resource you are looking for',
        409: 'It seems like there is a conflict with the current state of the resource',
        429: 'Wow-wow, slow down, you are making too many requests',
        500: 'Ahh, something went wrong on our side, please try again later',
        503: 'Oh, it seems like our service is not available right now, please try again later',
      }

      return (
        statusToMessage[error.httpStatus] || 'Oops, something went wrong, please try again later'
      )
    }

    switch (error.constructor) {
      case ProviderUserRejectedRequest:
        return 'Oh, seems like you rejected the request'
      case ProviderResourceUnavailable:
        return 'Hmm, check out MetaMask, seems like the request is pending'
      default:
        return 'Oops, something went wrong, please try again later'
    }
  }
}
