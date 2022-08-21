import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
import { Link } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Typography } from '@strapi/design-system/Typography';

const mockEntries = [
  {
    createdAt: new Date().toISOString(),
    adminUser: {
      id: 1,
      firstname: 'Kevin',
    },
    adminUserIPAddress: '2a01:e11:2002:c780:24e8:fd51:11fc:e03d',
    url: 'https://google.com',
    action: 'collection-types.action.update',
    entityModel: 'api::address.address',
    entityID: 2,
    responseCode: 200,
  },
];

const LogsTable = ({ entries = mockEntries }) => {
  const { formatMessage, formatDate } = useIntl();

  const HEADERS = useMemo(
    () => [
      {
        id: 'date',
        label: formatMessage({ id: getTrad('logs_table.date'), defaultMessage: 'Date' }),
        render: ({ createdAt }) => (
          <Typography textColor="neutral800">
            {formatDate(createdAt, {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </Typography>
        ),
      },
      {
        id: 'user',
        label: formatMessage({ id: getTrad('logs_table.user'), defaultMessage: 'User' }),
        render: ({ adminUser: { firstname, id, username } }) => (
          <Typography textColor="neutral800">
            <Link to={`/settings/users/${id}`}>{username || firstname}</Link>
          </Typography>
        ),
      },
      {
        id: 'eventCategory',
        label: formatMessage({
          id: getTrad('logs_table.event_category'),
          defaultMessage: 'Event category',
        }),
        render: () => <Typography textColor="neutral800">Test</Typography>,
      },
      {
        id: 'action',
        label: formatMessage({
          id: getTrad('logs_table.action'),
          defaultMessage: 'Action',
        }),
        render: ({ action }) => <Typography textColor="neutral800">{action}</Typography>,
      },
      {
        id: 'affectedItems',
        label: formatMessage({
          id: getTrad('logs_table.affected_items'),
          defaultMessage: 'Affected items',
        }),
        render: ({ entityID }) => <Typography textColor="neutral800">{entityID}</Typography>,
      },
    ],
    [formatMessage]
  );

  return (
    <Table colCount={HEADERS.length} rowCount={entries.length}>
      <Thead>
        <Tr>
          {HEADERS.map(({ id, label }) => (
            <Th key={id}>
              <Typography variant="sigma">{label}</Typography>
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {entries.map(entry => (
          <Tr>
            {HEADERS.map(({ id, render }) => (
              <Td key={id}>{render(entry)}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default LogsTable;
