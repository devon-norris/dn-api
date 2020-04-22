const orgWithNoUsers = '123'
const orgWithUsers = '456'

jest.mock('../../db/models/users', () => ({
  find: async ({ orgId }: any) => (orgId === orgWithUsers ? [{ fName: 'test user' }] : []),
}))

import { deleteOrganizationValidator, organizationResponseOmit } from '../organizations'

describe('deleteOrganizationValidator', () => {
  test('An organization without users can be deleted', async () => {
    // @ts-ignore
    const deleteOrgWithNoUsersRes = await deleteOrganizationValidator({ id: orgWithNoUsers })
    expect(deleteOrgWithNoUsersRes.isValid).toBeTruthy()
  })

  test('An organization with users cannot be deleted', async () => {
    // @ts-ignore
    const deleteOrgWithUsersRes = await deleteOrganizationValidator({ id: orgWithUsers })
    expect(deleteOrgWithUsersRes.isValid).toBeFalsy()
  })
})

describe('organizationResponseOmit', () => {
  let mockOrgData = { name: 'Test Org', _id: '123', phone: '2223334545' }
  test('Omits sensitive data if user is not a superadmin', () => {
    // @ts-ignore
    const omittedDataArr = organizationResponseOmit([mockOrgData], { user: { role: 'admin' } })
    expect(omittedDataArr).not.toEqual(mockOrgData)
    expect(omittedDataArr[0].phone).toBeUndefined()
    expect(omittedDataArr[0].name).toEqual(mockOrgData.name)
    // @ts-ignore
    const ommittedDataObj = organizationResponseOmit(mockOrgData, { user: { role: 'orgadmin' } })
    expect(ommittedDataObj).not.toEqual(mockOrgData)
    expect(ommittedDataObj.phone).toBeUndefined()
    expect(ommittedDataObj._id).toEqual(mockOrgData._id)
  })

  test('Does not omit anything if role is superadmin', () => {
    // @ts-ignore
    const returnsOriginalData = organizationResponseOmit(mockOrgData, { user: { role: 'superadmin' } })
    expect(returnsOriginalData).toEqual(mockOrgData)
  })
})
