import { connect } from 'react-redux';

import AbstractButtonCustom, { IProps as AbstractButtonCustomProps } from './AbstractButtonCustom';
import { navigate } from '../react/features/mobile/navigation/components/conference/ConferenceNavigationContainerRef';
import { translate } from '../react/features/base/i18n/functions';
import { getUnreadCount } from '../react/features/chat/functions';
import { getUnreadPollCount } from '../react/features/polls/functions';
import { IReduxState } from '../react/features/app/types';
import { CHAT_ENABLED } from '../react/features/base/flags/constants';
import { getFeatureFlag } from '../react/features/base/flags/functions';
import { IconChatUnread, IconMessage } from '../react/features/base/icons/svg';
import { screen } from '../react/features/mobile/navigation/routes';

interface IProps extends AbstractButtonCustomProps {

    /**
     * True if the polls feature is disabled.
     */
    _isPollsDisabled?: boolean;

    /**
     * The unread message count.
     */
    _unreadMessageCount: number;
}

/**
 * Implements an {@link AbstractButtonCustom} to open the chat screen on mobile.
 */
class ChatButton extends AbstractButtonCustom<IProps> {
    accessibilityLabel = 'toolbar.accessibilityLabel.chat';
    icon = IconMessage;
    label = 'toolbar.chat';
    toggledIcon = IconChatUnread;

    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        this.props._isPollsDisabled
            ? navigate(screen.conference.chat)
            : navigate(screen.conference.chatandpolls.main);
    }

    /**
     * Renders the button toggled when there are unread messages.
     *
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return Boolean(this.props._unreadMessageCount);
    }
}

/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component instance.
 * @returns {IProps}
 */
function _mapStateToProps(state: IReduxState, ownProps: any) {
    const enabled = getFeatureFlag(state, CHAT_ENABLED, true);
    const { disablePolls } = state['features/base/config'];
    const { visible = enabled } = ownProps;

    return {
        _isPollsDisabled: disablePolls,

        // The toggled icon should also be available for new polls
        _unreadMessageCount: getUnreadCount(state) || getUnreadPollCount(state),
        visible
    };
}

export default translate(connect(_mapStateToProps)(ChatButton));
