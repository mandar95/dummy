import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router'
import { Decrypt } from '../../../utils';
import { employeeInfo, clearUserInfo } from '../user.slice';

export default function GetUserInfo() {

  const dispatch = useDispatch();
  const { id } = useParams();
  const userId = Decrypt(id)

  useEffect(() => {
    if (userId)
      dispatch(employeeInfo(userId))

    return () => dispatch(clearUserInfo({}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return userId;
}
