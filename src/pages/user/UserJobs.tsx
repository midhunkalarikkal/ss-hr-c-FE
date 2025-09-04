import React from 'react';
import { jobsDummyData } from '@/utils/dummyData';
import CommonTable from '@/components/common/CommonTable';
import { adminFetchAllJobs } from '@/utils/apis/adminApi';
import type { UserfetchAllJobsResponse } from '@/types/apiTypes/user';
import { UserJobsTableColumns } from '@/components/table/tableColumns/UserJobsColumns';

const UserJobs: React.FC = () => {
    return (
        <CommonTable<UserfetchAllJobsResponse>
            fetchApiFunction={adminFetchAllJobs}
            queryKey="jobs"
            heading="Jobs"
            description='Lit of jobs according to the comapnies'
            column={UserJobsTableColumns}
            columnsCount={4}
            dummyData={jobsDummyData}
            showDummyData={true}
        />
    )
}

export default UserJobs