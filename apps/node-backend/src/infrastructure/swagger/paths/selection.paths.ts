export const selectionPaths = {
    // API lấy Chapter cho Dropdown
    [`/chapters/selection`]: {
        get: {
            tags: ['Selection Data'],
            summary: 'Lấy danh sách chương học (Rút gọn cho Dropdown)',
            description: 'Chỉ trả về id (value) và name (label).',
            responses: {
                200: {
                    description: 'Thành công',
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/SelectionListResponse' } 
                        } 
                    }
                }
            }
        }
    },

    // API lấy License Category cho Dropdown
    [`/license-categories/selection`]: {
        get: {
            tags: ['Selection Data'],
            summary: 'Lấy danh sách hạng bằng lái (Rút gọn cho Dropdown)',
            description: 'Chỉ trả về id (value) và code (label).',
            responses: {
                200: {
                    description: 'Thành công',
                    content: { 
                        'application/json': { 
                            schema: { $ref: '#/components/schemas/SelectionListResponse' } 
                        } 
                    }
                }
            }
        }
    },

     [`/roles/selection`]: {
        get: {
            tags: ['Selection Data'],
            summary: 'Lấy danh sách chức vụ (Rút gọn cho Dropdown)',
            description: 'Chỉ trả về id (value) và code (label) của các vai trò/chức vụ.',
            responses: {
                200: {
                    description: 'Thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SelectionListResponse' }
                        }
                    }
                }
            }
        }
    }
};