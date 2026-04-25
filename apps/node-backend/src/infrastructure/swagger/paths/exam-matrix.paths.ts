export const examMatrixPaths = {
    [`/exam-matrices`]: {
        post: {
            tags: ['Exam Matrix Management'],
            summary: 'Tạo mới một ma trận đề thi',
            operationId: 'createExamMatrix',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateExamMatrixDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Tạo ma trận thành công',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/StandardResponse' },
                                    {
                                        type: 'object',
                                        properties: {
                                            data: { $ref: '#/components/schemas/ExamMatrixResponse' }
                                        }
                                    }
                                ]
                            },
                        },
                    },
                },
                '400': {
                    description: 'Lỗi nghiệp vụ hoặc dữ liệu đầu vào không hợp lệ',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            examples: {
                                InvalidInput: {
                                    summary: 'Dữ liệu không hợp lệ',
                                    value: { success: false, code: 'SYS_400', message: 'Dữ liệu đầu vào không đúng định dạng' }
                                },
                                LicenseNotFound: {
                                    summary: 'Hạng bằng không tồn tại',
                                    value: { success: false, code: 'LICENSE_NOT_FOUND', message: 'Hạng giấy phép lái xe không tồn tại' }
                                },
                                ChapterNotFound: {
                                    summary: 'Chương học không tồn tại',
                                    value: { success: false, code: 'CHAPTER_NOT_FOUND', message: 'Một hoặc nhiều chương học không tồn tại trong hệ thống' }
                                },
                                DuplicateChapter: {
                                    summary: 'Trùng lặp chương học',
                                    value: { success: false, code: 'DUPLICATE_CHAPTER', message: 'Một chương học không được xuất hiện hai lần trong một ma trận' }
                                },
                                NoDetails: {
                                    summary: 'Thiếu chi tiết chương',
                                    value: { success: false, code: 'MATRIX_NO_DETAILS', message: 'Ma trận phải có ít nhất một chương' }
                                },
                                InvalidPercentage: {
                                    summary: 'Tổng % không bằng 100',
                                    value: { success: false, code: 'INVALID_MATRIX_PERCENTAGE', message: 'Tổng tỉ trọng các chương phải bằng 100%' }
                                },
                                InvalidScore: {
                                    summary: 'Điểm đạt không hợp lệ',
                                    value: { success: false, code: 'INVALID_PASSING_SCORE', message: 'Điểm đạt không được lớn hơn tổng số câu hỏi' }
                                }
                            }
                        }
                    }
                },
                '404': {
                    description: 'Không tìm thấy tài nguyên liên quan',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            examples: {
                                LicenseNotFound: {
                                    summary: 'Không thấy hạng bằng',
                                    value: { success: false, code: 'LICENSE_NOT_FOUND', message: 'Hạng bằng lái không tồn tại' }
                                },
                                ChapterNotFound: {
                                    summary: 'Không thấy chương',
                                    value: { success: false, code: 'CHAPTER_NOT_FOUND', message: 'Một hoặc nhiều chương cung cấp không tồn tại' }
                                }
                            }
                        }
                    }
                },
                '409': {
                    description: 'Lỗi nghiệp vụ hoặc dữ liệu đầu vào không hợp lệ',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            examples: {
                                DuplicateChapter: {
                                    summary: 'Trùng lặp chương',
                                    value: { success: false, code: 'DUPLICATE_CHAPTER_IN_MATRIX', message: 'Một chương không được xuất hiện nhiều lần trong ma trận' }
                                }
                            }
                        }
                    }
                }
            },
        },
    },

    // ==================== MA TRẬN THEO ID (GET - PUT - DELETE) ====================
    [`/exam-matrices/{id}`]: {
        put: {
            tags: ['Exam Matrix Management'],
            summary: 'Cập nhật thông tin ma trận',
            operationId: 'updateExamMatrix',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string', format: 'uuid' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateExamMatrixDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Cập nhật thành công',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/StandardResponse' },
                                    {
                                        type: 'object',
                                        properties: {
                                            data: { $ref: '#/components/schemas/ExamMatrixResponse' }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                '400': {
                    description: 'Lỗi dữ liệu cập nhật',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            examples: {
                                IdRequired: {
                                    summary: 'Thiếu ID',
                                    value: { success: false, code: 'ID_REQUIRED', message: 'ID ma trận là bắt buộc' }
                                },
                                InvalidPercentage: {
                                    summary: 'Tổng % không bằng 100',
                                    value: { success: false, code: 'INVALID_MATRIX_PERCENTAGE', message: 'Tổng tỉ trọng các chương phải bằng 100%' }
                                },
                            }
                        }
                    }
                },
                '404': {
                    description: 'Không tìm thấy ma trận hoặc chương',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            examples: {
                                MatrixNotFound: {
                                    summary: 'Không thấy ma trận',
                                    value: { success: false, code: 'MATRIX_NOT_FOUND', message: 'Không tìm thấy ma trận đề thi yêu cầu' }
                                },
                                ChapterNotFound: {
                                    summary: 'Không thấy chương',
                                    value: { success: false, code: 'CHAPTER_NOT_FOUND', message: 'Chương cập nhật không tồn tại' }
                                }
                            }
                        }
                    }
                },
                '409': {
                    description: 'Lỗi nghiệp vụ hoặc dữ liệu đầu vào không hợp lệ',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            examples: {
                                DuplicateChapter: {
                                    summary: 'Trùng lặp chương',
                                    value: { success: false, code: 'DUPLICATE_CHAPTER_IN_MATRIX', message: 'Một chương không được xuất hiện nhiều lần trong ma trận' }
                                }
                            }
                        }
                    }
                }
            },
        },

        get: {
            tags: ['Exam Matrix Management'],
            summary: 'Lấy thông tin chi tiết Ma trận',
            operationId: 'getExamMatrixById',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của ma trận cần lấy thông tin',
                    schema: { type: 'string', format: 'uuid' }
                }
            ],
            responses: {
                '200': {
                    description: 'Lấy dữ liệu thành công',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/StandardResponse' },
                                    { type: 'object', properties: { data: { $ref: '#/components/schemas/ExamMatrixResponse' } } }
                                ]
                            }
                        }
                    }
                },
                '400': {
                    description: 'Lỗi tham số đầu vào',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                code: 'ID_REQUIRED',
                                statusCode: 400,
                                message: 'ID ma trận là bắt buộc và phải đúng định dạng UUID'
                            }
                        }
                    }
                },
                '404': {
                    description: 'Không tìm thấy ma trận',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                code: 'MATRIX_NOT_FOUND',
                                statusCode: 404,
                                message: 'Không tìm thấy ma trận đề thi yêu cầu'
                            }
                        }
                    }
                }
            }
        },

        delete: {
            tags: ['Exam Matrix Management'],
            summary: 'Xóa thông minh Ma trận (Smart Delete)',
            operationId: 'deleteExamMatrix',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của ma trận cần xóa',
                    schema: { type: 'string', format: 'uuid' }
                }
            ],
            responses: {
                '200': {
                    description: 'Xóa thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/StandardResponse' }
                        }
                    }
                },
                '400': {
                    description: 'Lỗi tham số đầu vào',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                code: 'ID_REQUIRED',
                                statusCode: 400,
                                message: 'ID ma trận không được để trống'
                            }
                        }
                    }
                },
                '404': {
                    description: 'Không tìm thấy ma trận để xóa',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                code: 'MATRIX_NOT_FOUND',
                                statusCode: 404,
                                message: 'Ma trận không tồn tại để thực hiện thao tác xóa'
                            }
                        }
                    }
                }
            }
        }
    },

    // ==================== KHÔI PHỤC MA TRẬN ====================
    [`/exam-matrices/{id}/restore`]: {
        patch: {
            tags: ['Exam Matrix Management'],
            summary: 'Khôi phục Ma trận đã xóa mềm',
            operationId: 'restoreExamMatrix',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string', format: 'uuid' }
                }
            ],
            responses: {
                '200': {
                    description: 'Khôi phục thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/StandardResponse' }
                        }
                    }
                },
                '400': {
                    description: 'Lỗi khôi phục (Ví dụ: Đã có ma trận khác cho hạng bằng này)',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                code: 'MATRIX_RESTORE_FAILED_DUPLICATE',
                                message: 'Đã tồn tại ma trận hoạt động cho hạng bằng này, không thể khôi phục.'
                            }
                        }
                    }
                }
            }
        }
    }
};