// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';
import styled from 'styled-components';

import {NotifyAdminRequest} from '@mattermost/types/cloud';
import {useGetNotifyAdmin, NotifyStatus, NotifyStatusValues} from 'components/common/hooks/useGetNotifyAdmin';

const Span = styled.span`
font-family: 'Open Sans';
font-size: 12px;
font-style: normal;
font-weight: 600;
line-height: 16px;
`;

const Button = styled.button`
border: none;
background: none;
color: var(--denim-button-bg);
text-decoration: none;
display: inline;
`;

export enum DafaultBtnText {
    NotifyAdmin = 'Notify your admin',
    Notifying = 'Notifying...',
    Notified = 'Notified!',
    AlreadyNotified = 'Already notified!',
    Failed = 'Try again later!',
}

type HookProps = {
    ctaText?: React.ReactNode;
    preTrial?: boolean;
}

type Props = HookProps & {
    callerInfo: string;
    notifyRequestData: NotifyAdminRequest;
}

type ValueOf<T> = T[keyof T]

export function useNotifyAdmin<T = HTMLAnchorElement | HTMLButtonElement>(props: HookProps, reqData: NotifyAdminRequest): [React.ReactNode, (e: React.MouseEvent<T, MouseEvent>, callerInfo: string) => void, ValueOf<typeof NotifyStatus>] {
    const {btnText: btnFormaText, notifyAdmin, notifyStatus} = useGetNotifyAdmin({});
    const {formatMessage} = useIntl();

    const btnText = (status: NotifyStatusValues): React.ReactNode => {
        switch (status) {
        case NotifyStatus.Started:
        case NotifyStatus.Success:
        case NotifyStatus.AlreadyComplete:
        case NotifyStatus.Failed:
            return formatMessage(btnFormaText(status));
        default:
            return props.ctaText || formatMessage(btnFormaText(NotifyStatus.NotStarted));
        }
    };

    const notifyFunc = async (e: React.MouseEvent<T, MouseEvent>, callerInfo: string) => {
        e.preventDefault();
        e.stopPropagation();
        notifyAdmin({
            trackingArgs: {
                category: 'pricing',
                event: 'click_notify_admin_cta',
                props: {
                    callerInfo,
                },
            },
            requestData: reqData,
        });
    };

    return [btnText(notifyStatus), notifyFunc, notifyStatus];
}

function NotifyAdminCTA(props: Props) {
    const [btnText, notify, status] = useNotifyAdmin(props, props.notifyRequestData);
    const {formatMessage} = useIntl();
    let title = formatMessage({id: 'pricing_modal.wantToUpgrade', defaultMessage: 'Want to upgrade? '});
    if (props.preTrial) {
        title = formatMessage({id: 'pricing_modal.wantToTry', defaultMessage: 'Want to try? '});
    }

    return (
        <>
            {props.ctaText ? (
                <span>
                    <Button
                        id='notify_admin_cta'
                        onClick={(e) => notify(e, props.callerInfo)}
                        disabled={status === NotifyStatus.AlreadyComplete}
                    >
                        {btnText}
                    </Button>
                </span>
            ) : (
                <Span id='notify_cta_container'>
                    {title}
                    <Button
                        id='notify_admin_cta'
                        onClick={(e) => notify(e, props.callerInfo)}
                        disabled={status === NotifyStatus.AlreadyComplete}
                    >
                        {btnText}
                    </Button>
                </Span>
            )}
        </>);
}

export default NotifyAdminCTA;
