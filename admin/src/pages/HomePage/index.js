import { BaseHeaderLayout } from '@strapi/design-system/Layout';

import React from 'react';
import { useIntl } from 'react-intl';
import { Layout } from '@strapi/design-system/Layout';
import { Box } from '@strapi/design-system/Box';
import { Stack } from '@strapi/design-system/Stack';
import { Typography } from '@strapi/design-system/Typography';
import { request, DynamicTable, useQueryParams, useNotification } from '@strapi/helper-plugin';
import { Tbody, Tr, Td } from '@strapi/design-system/Table';
import { useQuery } from 'react-query';
import getTrad from '../../utils/getTrad';
import pluginId from '../../pluginId';
import _ from 'lodash';

const HEADERS = [
  {
    name: 'id',
    key: 'id',
    metadatas: {
      label: 'ID',
      sortable: true,
    },
  },
  {
    name: 'createdAt',
    key: 'createdAt',
    metadatas: {
      label: 'Created at',
      sortable: true,
    },
  },
  {
    name: 'Admin',
    key: 'user.firstname',
    metadatas: {
      label: 'Admin',
      sortable: true,
    },
  },
  {
    name: 'Plugin',
    key: 'plugin',
    metadatas: {
      label: 'Plugin',
      sortable: true,
    },
  },
  {
    name: 'Action',
    key: 'action',
    metadatas: {
      label: 'Action',
      sortable: true,
    },
  },
  {
    name: 'URL',
    key: 'url',
    metadatas: {
      label: 'URL',
      sortable: true,
    },
  },
];

const HomePage = () => {
  const { formatMessage } = useIntl();
  const [{ query }] = useQueryParams();
  const toggleNotification = useNotification();

  const { status, data, isFetching } = useQuery(
    'audit-logs',
    async () => {
      const data = await request(`/${pluginId}/find`, {
        method: 'GET',
        params: {
          ...query,
          populate: '*',
        },
      });

      console.log(data);

      return data;
    },
    {
      keepPreviousData: true,
      retry: false,
      staleTime: 1000 * 20,
      onError: () => {
        toggleNotification({
          type: 'warning',
          message: { id: 'notification.error', defaultMessage: 'An error occured' },
        });
      },
    }
  );

  return (
    <>
      <BaseHeaderLayout title={formatMessage({ id: getTrad('homepage.audit_logs') })} />
      <Layout>
        <Box paddingLeft={10} paddingRight={10}>
          <Stack spacing={4}>
            <DynamicTable
              contentType={`plugin::${pluginId}.log`}
              isLoading={isFetching}
              rows={data}
              headers={HEADERS}
            >
              {data && (
                <Tbody>
                  {data.map(log => (
                    <Tr key={log.id}>
                      {HEADERS.map(({ key }) => (
                        <Td key={key}>
                          <Typography textColor="neutral800">{_.get(log, key)}</Typography>
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              )}
            </DynamicTable>
            {/* <LogsTable /> */}
          </Stack>
        </Box>
      </Layout>
    </>
  );
};

export default HomePage;
